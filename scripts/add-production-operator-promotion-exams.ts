import { PrismaClient } from "@prisma/client";
import {
  PRODUCTION_OPERATOR_PROMOTION_ITEMS_A,
  PRODUCTION_OPERATOR_PROMOTION_ITEMS_B,
} from "../prisma/seed-data/production-operator-promotion-ability-items";

const db = new PrismaClient();

async function main() {
  console.log(
    "→ Üretim Operatörü terfi sınavları oluşturuluyor..."
  );

  if (
    PRODUCTION_OPERATOR_PROMOTION_ITEMS_A.length !== 40 ||
    PRODUCTION_OPERATOR_PROMOTION_ITEMS_B.length !== 40
  ) {
    throw new Error(
      `40 + 40 soru bekleniyor. Form A: ${PRODUCTION_OPERATOR_PROMOTION_ITEMS_A.length}, Form B: ${PRODUCTION_OPERATOR_PROMOTION_ITEMS_B.length}`
    );
  }

  const position = await db.position.findFirst({
    where: {
      name: "Üretim Operatörü",
    },
  });

  if (!position) {
    throw new Error(
      "Üretim Operatörü pozisyonu bulunamadı."
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

  const existingA = await db.testForm.findUnique({
    where: {
      code: "GY-TRF-URT-A",
    },
  });

  const existingB = await db.testForm.findUnique({
    where: {
      code: "GY-TRF-URT-B",
    },
  });

  if (existingA || existingB) {
    throw new Error(
      "GY-TRF-URT-A veya GY-TRF-URT-B zaten mevcut."
    );
  }

  async function createForm(
    code: string,
    name: string,
    questions: typeof PRODUCTION_OPERATOR_PROMOTION_ITEMS_A
  ) {
    return db.$transaction(async (tx) => {
      const form = await tx.testForm.create({
        data: {
          code,
          name,
          kind: "YETENEK",
          description:
            "Üretim Operatörü mavi yaka terfi Genel Yetenek değerlendirmesi.",
        },
      });

      const section = await tx.testSection.create({
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

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];

        const item = await tx.item.create({
          data: {
            type: "COKTAN_SECMELI",
            text: q.text,
            dimension: q.dimension,
            difficulty: q.difficulty,
            options: JSON.stringify(q.options),
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

  const formA = await createForm(
    "GY-TRF-URT-A",
    "Genel Yetenek Testi — Üretim Operatörü Terfi Form A",
    PRODUCTION_OPERATOR_PROMOTION_ITEMS_A
  );

  const formB = await createForm(
    "GY-TRF-URT-B",
    "Genel Yetenek Testi — Üretim Operatörü Terfi Form B",
    PRODUCTION_OPERATOR_PROMOTION_ITEMS_B
  );

  const firstPackage =
    await db.examPackage.create({
      data: {
        name:
          "Üretim Operatörü Terfi Sınavı — Form A",
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
          "Üretim Operatörü Terfi Tekrar Sınavı — Form B",
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
    `  Hedef pozisyon: ${position.name}`
  );
  console.log(
    "  Pozisyonun mevcut işe giriş paketi değiştirilmedi."
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