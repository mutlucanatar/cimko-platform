import { PrismaClient } from "@prisma/client";
import {
  LABORATORY_WORKER_ABILITY_ITEMS_A,
  LABORATORY_WORKER_ABILITY_ITEMS_B,
} from "../prisma/seed-data/laboratory-worker-ability-items";

const db = new PrismaClient();

async function main() {
  console.log(
    "→ Laboratuvar İşçisi sınavları oluşturuluyor..."
  );

  if (
    LABORATORY_WORKER_ABILITY_ITEMS_A.length !== 40 ||
    LABORATORY_WORKER_ABILITY_ITEMS_B.length !== 40
  ) {
    throw new Error(
      `40 + 40 soru bekleniyor. Form A: ${LABORATORY_WORKER_ABILITY_ITEMS_A.length}, Form B: ${LABORATORY_WORKER_ABILITY_ITEMS_B.length}`
    );
  }

  const position =
    await db.position.findFirst({
      where: {
        name: "Laboratuvar İşçisi",
      },
    });

  if (!position) {
    throw new Error(
      "Laboratuvar İşçisi pozisyonu bulunamadı."
    );
  }

  const cke =
    await db.testForm.findUnique({
      where: {
        code: "CKE-01",
      },
    });

  if (!cke) {
    throw new Error("CKE-01 bulunamadı.");
  }

  const existingA =
    await db.testForm.findUnique({
      where: {
        code: "GY-KAL-A",
      },
    });

  const existingB =
    await db.testForm.findUnique({
      where: {
        code: "GY-KAL-B",
      },
    });

  if (existingA || existingB) {
    throw new Error(
      "GY-KAL-A veya GY-KAL-B zaten mevcut."
    );
  }

  async function createAbilityForm(
    code: string,
    name: string,
    questions: typeof LABORATORY_WORKER_ABILITY_ITEMS_A
  ) {
    return db.$transaction(
      async (tx) => {
        const form =
          await tx.testForm.create({
            data: {
              code,
              name,
              kind: "YETENEK",
              description:
                "Laboratuvar İşçisi işe giriş Genel Yetenek değerlendirmesi.",
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
      }
    );
  }

  const formA =
    await createAbilityForm(
      "GY-KAL-A",
      "Genel Yetenek Testi — Laboratuvar İşçisi Form A",
      LABORATORY_WORKER_ABILITY_ITEMS_A
    );

  const formB =
    await createAbilityForm(
      "GY-KAL-B",
      "Genel Yetenek Testi — Laboratuvar İşçisi Form B",
      LABORATORY_WORKER_ABILITY_ITEMS_B
    );

  const firstPackage =
    await db.examPackage.create({
      data: {
        name:
          "Laboratuvar İşçisi Sınav Uygulaması",
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
          "Laboratuvar İşçisi Tekrar Sınav Uygulaması",
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
  console.log(
    `  Form A: ${formA.code}`
  );
  console.log(
    `  Form B: ${formB.code}`
  );
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