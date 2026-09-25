import { PrismaClient } from "@prisma/client";
import {
  MECHANICAL_MAINTENANCE_ABILITY_ITEMS_A,
  MECHANICAL_MAINTENANCE_ABILITY_ITEMS_B,
} from "../prisma/seed-data/mechanical-maintenance-ability-items";

const db = new PrismaClient();

async function main() {
  console.log(
    "→ Mekanik Bakım Elemanı sınavları oluşturuluyor..."
  );

  if (
    MECHANICAL_MAINTENANCE_ABILITY_ITEMS_A.length !== 40 ||
    MECHANICAL_MAINTENANCE_ABILITY_ITEMS_B.length !== 40
  ) {
    throw new Error(
      "Form A ve Form B'nin her biri 40 soru olmalıdır."
    );
  }

  const position = await db.position.findFirst({
    where: {
      name: "Mekanik Bakım Elemanı",
    },
  });

  if (!position) {
    throw new Error(
      "Mekanik Bakım Elemanı pozisyonu bulunamadı."
    );
  }

  const cke = await db.testForm.findUnique({
    where: {
      code: "CKE-01",
    },
  });

  if (!cke) {
    throw new Error("CKE-01 bulunamadı.");
  }

  const existingA =
    await db.testForm.findUnique({
      where: { code: "GY-MEK-A" },
    });

  const existingB =
    await db.testForm.findUnique({
      where: { code: "GY-MEK-B" },
    });

  if (existingA || existingB) {
    throw new Error(
      "GY-MEK-A veya GY-MEK-B zaten mevcut."
    );
  }

  async function createAbilityForm(
    code: string,
    name: string,
    questions: typeof MECHANICAL_MAINTENANCE_ABILITY_ITEMS_A
  ) {
    return db.$transaction(async (tx) => {
      const form =
        await tx.testForm.create({
          data: {
            code,
            name,
            kind: "YETENEK",
            description:
              "Mekanik Bakım Elemanı işe giriş Genel Yetenek değerlendirmesi.",
          },
        });

      const section =
        await tx.testSection.create({
          data: {
            testFormId: form.id,
            name: "Genel Yetenek",
            order: 0,
            durationMin: 30,
            allowSkip: true,
            shuffle: false,
            instruction:
              "40 soruyu 30 dakika içinde yanıtlayınız.",
          },
        });

      for (
        let i = 0;
        i < questions.length;
        i++
      ) {
        const q = questions[i];

        const item =
          await tx.item.create({
            data: {
              type: "COKTAN_SECMELI",
              text: q.text,
              dimension: q.dimension,
              difficulty: q.difficulty,
              options:
                JSON.stringify(q.options),
              correctKey: q.correctKey,
            },
          });

        await tx.testItem.create({
          data: {
            sectionId: section.id,
            itemId: item.id,
            order: i,
          },
        });
      }

      return form;
    });
  }

  const formA =
    await createAbilityForm(
      "GY-MEK-A",
      "Genel Yetenek Testi — Mekanik Bakım Form A",
      MECHANICAL_MAINTENANCE_ABILITY_ITEMS_A
    );

  const formB =
    await createAbilityForm(
      "GY-MEK-B",
      "Genel Yetenek Testi — Mekanik Bakım Form B",
      MECHANICAL_MAINTENANCE_ABILITY_ITEMS_B
    );

  const firstPackage =
    await db.examPackage.create({
      data: {
        name:
          "Mekanik Bakım Elemanı Sınav Uygulaması",
        isActive: true,
        tests: {
          create: [
            {
              testFormId: formA.id,
              order: 1,
            },
            {
              testFormId: cke.id,
              order: 2,
            },
          ],
        },
      },
    });

  const retryPackage =
    await db.examPackage.create({
      data: {
        name:
          "Mekanik Bakım Elemanı Tekrar Sınav Uygulaması",
        isActive: true,
        tests: {
          create: [
            {
              testFormId: formB.id,
              order: 1,
            },
            {
              testFormId: cke.id,
              order: 2,
            },
          ],
        },
      },
    });

  await db.position.update({
    where: {
      id: position.id,
    },
    data: {
      examPackageId: firstPackage.id,
      cutoffScore: 50,
      normScore: 65,
    },
  });

  console.log("✓ Tamamlandı.");
  console.log(`  Form A: ${formA.code}`);
  console.log(`  Form B: ${formB.code}`);
  console.log(
    `  İlk paket: ${firstPackage.name}`
  );
  console.log(
    `  Tekrar paketi: ${retryPackage.name}`
  );
  console.log(
    `  Pozisyon: ${position.name}`
  );
}

main()
  .catch((error) => {
    console.error("HATA:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });