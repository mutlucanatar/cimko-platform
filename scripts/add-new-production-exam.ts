import { PrismaClient } from "@prisma/client";
import { NEW_PRODUCTION_ABILITY_ITEMS } from "../prisma/seed-data/new-production-ability-items";

const db = new PrismaClient();

async function main() {
  console.log("→ Yeni Üretim Elemanı sınav yapısı oluşturuluyor...");

  const position = await db.position.findFirst({
    where: {
      name: "Yeni Üretim Elemanı",
    },
  });

  if (!position) {
    throw new Error(
      "Yeni Üretim Elemanı pozisyonu bulunamadı."
    );
  }

  const cke = await db.testForm.findFirst({
    where: {
      code: "CKE-01",
    },
  });

  if (!cke) {
    throw new Error(
      "ÇKE test formu bulunamadı."
    );
  }

  const existingForm =
    await db.testForm.findFirst({
      where: {
        code: "GY-YUR",
      },
    });

  if (existingForm) {
    throw new Error(
      "GY-YUR zaten mevcut. Script daha önce çalıştırılmış olabilir."
    );
  }

  const result = await db.$transaction(
    async (tx) => {
      // 1. Yeni 40 soru
      const itemIds: string[] = [];

      for (
        const q of NEW_PRODUCTION_ABILITY_ITEMS
      ) {
        const item = await tx.item.create({
          data: {
            type: "COKTAN_SECMELI",
            text: q.text,
            dimension: q.dimension,
            options: JSON.stringify(
              q.options
            ),
            correctKey: q.correctKey,
            difficulty: q.difficulty,
          },
        });

        itemIds.push(item.id);
      }

      // 2. Yeni yetenek testi
      const testForm =
        await tx.testForm.create({
          data: {
            name:
              "Genel Yetenek Testi — Yeni Üretim",
            code: "GY-YUR",
            kind: "YETENEK",
            description:
              "Yeni mezun ve deneyimsiz üretim adaylarının sayısal, sözel, soyut düşünme ve dikkat becerilerini değerlendirir.",
          },
        });

      // 3. 30 dakikalık bölüm
      const section =
        await tx.testSection.create({
          data: {
            testFormId: testForm.id,
            name: "Genel Yetenek",
            order: 0,
            durationMin: 30,
            allowSkip: true,
            instruction:
              "40 soruyu 30 dakika içinde yanıtlayınız. Sorular sayısal, sözel, soyut düşünme ve dikkat becerilerini ölçmektedir.",
          },
        });

      // 4. Soruları teste bağla
      for (
        let i = 0;
        i < itemIds.length;
        i++
      ) {
        await tx.testItem.create({
          data: {
            sectionId: section.id,
            itemId: itemIds[i],
            order: i,
          },
        });
      }

      // 5. Yeni sınav paketi
      const examPackage =
        await tx.examPackage.create({
          data: {
            name:
              "Yeni Üretim Elemanı Sınav Uygulaması",
            isActive: true,
          },
        });

      // 6. Önce Genel Yetenek
      await tx.examPackageTest.create({
        data: {
          examPackageId:
            examPackage.id,
          testFormId: testForm.id,
          order: 1,
        },
      });

      // 7. Sonra ÇKE
      await tx.examPackageTest.create({
        data: {
          examPackageId:
            examPackage.id,
          testFormId: cke.id,
          order: 2,
        },
      });

      // 8. Pozisyonu yeni pakete bağla
      await tx.position.update({
        where: {
          id: position.id,
        },
        data: {
          examPackageId:
            examPackage.id,
          cutoffScore: 50,
          normScore: 60,
        },
      });

      return {
        testForm,
        examPackage,
        itemCount: itemIds.length,
      };
    }
  );

  console.log("✓ Tamamlandı.");
  console.log(
    `  Yeni soru: ${result.itemCount}`
  );
  console.log(
    `  Test: ${result.testForm.name}`
  );
  console.log(
    `  Paket: ${result.examPackage.name}`
  );
  console.log(
    "  Pozisyon: Yeni Üretim Elemanı"
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