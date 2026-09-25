import { PrismaClient } from "@prisma/client";
import { NEW_PRODUCTION_ABILITY_ITEMS_FORM_B } from "../prisma/seed-data/new-production-ability-items-form-b";

const db = new PrismaClient();

async function main() {
  console.log(
    "GY-YUR-B / Yeni Üretim Elemanı Form B oluşturuluyor..."
  );

  const questions =
    NEW_PRODUCTION_ABILITY_ITEMS_FORM_B;

  console.log(
    `Kaynak soru sayısı: ${questions.length}`
  );
    if (questions.length !== 40) {
    throw new Error(
      `Form B için 40 soru bekleniyor. Mevcut: ${questions.length}`
    );
  }

  const existingForm =
    await db.testForm.findUnique({
      where: {
        code: "GY-YUR-B",
      },
    });

  if (existingForm) {
    console.log(
      "GY-YUR-B zaten mevcut. Yeni kayıt oluşturulmayacak."
    );
    return;
  }

  const cke =
    await db.testForm.findUnique({
      where: {
        code: "CKE-01",
      },
    });

  if (!cke) {
    throw new Error(
      "CKE-01 test formu bulunamadı."
    );
  }

  const position =
    await db.position.findFirst({
      where: {
        name: "Yeni Üretim Elemanı",
      },
    });

  if (!position) {
    throw new Error(
      "Yeni Üretim Elemanı pozisyonu bulunamadı."
    );
  }

  if (!position.examPackageId) {
    throw new Error(
      "Yeni Üretim Elemanı için mevcut sınav paketi bulunamadı."
    );
  }
    const result =
    await db.$transaction(async (tx) => {
      const testForm =
        await tx.testForm.create({
          data: {
            name:
              "Genel Yetenek Testi — Yeni Üretim Form B",
            code: "GY-YUR-B",
            kind: "YETENEK",
            description:
              "Yeni Üretim Elemanı işe giriş sınavının tekrar uygulaması için eşdeğer alternatif Genel Yetenek formudur.",
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
              "40 soruyu 30 dakika içinde yanıtlayınız. Sorular sayısal, sözel, soyut düşünme ve dikkat becerilerini ölçmektedir.",
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
              type:
                "COKTAN_SECMELI",
              text: q.text,
              dimension:
                q.dimension,
              difficulty:
                q.difficulty,
              options:
                JSON.stringify(q.options),
              correctKey:
                q.correctKey,
            },
          });

        await tx.testItem.create({
          data: {
            sectionId:
              section.id,
            itemId:
              item.id,
            order: i,
          },
        });
      }

      const retryPackage =
        await tx.examPackage.create({
          data: {
            name:
              "Yeni Üretim Elemanı Tekrar Sınav Uygulaması",
            isActive: true,
          },
        });

      await tx.examPackageTest.create({
        data: {
          examPackageId:
            retryPackage.id,
          testFormId:
            testForm.id,
          order: 1,
        },
      });

      await tx.examPackageTest.create({
        data: {
          examPackageId:
            retryPackage.id,
          testFormId:
            cke.id,
          order: 2,
        },
      });

      return {
        testFormId:
          testForm.id,
        retryPackageId:
          retryPackage.id,
      };
    });

  console.log(
    "✓ GY-YUR-B oluşturuldu."
  );

  console.log(
    `  40 soru eklendi.`
  );

  console.log(
    `  Test ID: ${result.testFormId}`
  );

  console.log(
    `  Tekrar paketi ID: ${result.retryPackageId}`
  );

  console.log(
    "  Mevcut ilk sınav paketi değiştirilmedi."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });