import { PrismaClient } from "@prisma/client";
import {
  WAREHOUSE_CLERK_ABILITY_ITEMS,
} from "../prisma/seed-data/warehouse-clerk-ability-items";

const db = new PrismaClient();

async function main() {
  console.log(
    "→ Ambarcı sınavı oluşturuluyor..."
  );

  if (
    WAREHOUSE_CLERK_ABILITY_ITEMS.length !==
    40
  ) {
    throw new Error(
      `40 soru bekleniyor. Bulunan: ${WAREHOUSE_CLERK_ABILITY_ITEMS.length}`
    );
  }

  const position =
    await db.position.findUnique({
      where: {
        id: "ambarci",
      },
    });

  if (!position) {
    throw new Error(
      "Ambarcı pozisyonu bulunamadı."
    );
  }

  const cke =
    await db.testForm.findUnique({
      where: {
        code: "CKE-01",
      },
    });

  if (!cke) {
    throw new Error(
      "CKE-01 bulunamadı."
    );
  }

  const existingForm =
    await db.testForm.findUnique({
      where: {
        code: "GY-AMB",
      },
    });

  if (existingForm) {
    throw new Error(
      "GY-AMB zaten mevcut."
    );
  }

  const form =
    await db.$transaction(
      async (tx) => {
        const testForm =
          await tx.testForm.create({
            data: {
              code: "GY-AMB",
              name:
                "Genel Yetenek Testi — Ambarcı",
              kind: "YETENEK",
              description:
                "Ambarcı işe giriş Genel Yetenek değerlendirmesi.",
            },
          });

        const section =
          await tx.testSection.create({
            data: {
              testFormId: testForm.id,
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
          i < WAREHOUSE_CLERK_ABILITY_ITEMS.length;
          i++
        ) {
          const q =
            WAREHOUSE_CLERK_ABILITY_ITEMS[i];

          const item =
            await tx.item.create({
              data: {
                type: "COKTAN_SECMELI",
                text: q.text,
                dimension: q.dimension,
                difficulty: q.difficulty,
                options:
                  JSON.stringify(
                    q.options
                  ),
                correctKey:
                  q.correctKey,
              },
            });

          await tx.testItem.create({
            data: {
              sectionId:
                section.id,
              itemId: item.id,
              order: i,
            },
          });
        }

        return testForm;
      }
    );

  const examPackage =
    await db.examPackage.create({
      data: {
        name:
          "Ambarcı Sınav Uygulaması",
        isActive: true,
        tests: {
          create: [
            {
              testFormId:
                form.id,
              order: 1,
            },
            {
              testFormId:
                cke.id,
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
      examPackageId:
        examPackage.id,
      cutoffScore: 50,
      normScore: 65,
    },
  });

  console.log("✓ Tamamlandı.");
  console.log(
    `  Form: ${form.code}`
  );
  console.log(
    `  Paket: ${examPackage.name}`
  );
  console.log(
    `  Pozisyon: ${position.name}`
  );
}

main()
  .catch((error) => {
    console.error(
      "HATA:",
      error
    );
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });