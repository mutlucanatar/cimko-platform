import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const facilityId =
    "cmrqdqm0j000xju2dfve58vyg";

  const facility =
    await db.facility.findUnique({
      where: { id: facilityId },
    });

  if (!facility) {
    throw new Error(
      "Adıyaman Çimento Fabrikası bulunamadı."
    );
  }

  // 1. Maden ve Hammadde departmanı
  let department =
    await db.department.findFirst({
      where: {
        facilityId,
        name: "Maden ve Hammadde",
      },
    });

  if (!department) {
    department =
      await db.department.create({
        data: {
          facilityId,
          name: "Maden ve Hammadde",
          isActive: true,
        },
      });

    console.log(
      "✓ Maden ve Hammadde departmanı oluşturuldu."
    );
  } else {
    console.log(
      "✓ Maden ve Hammadde departmanı zaten mevcut."
    );
  }

  // 2. Maden Mühendisi pozisyonu
  let position =
    await db.position.findFirst({
      where: {
        departmentId: department.id,
        name: "Maden Mühendisi",
      },
    });

  if (!position) {
    position =
      await db.position.create({
        data: {
          departmentId: department.id,
          name: "Maden Mühendisi",
          jobFamily: "DIGER",

          description:
            "Adıyaman Fabrikasında Maden ve Hammadde ekibinin bir parçası olarak maden operasyonlarının güvenli, kaliteli ve planlı şekilde yürütülmesine katkı sağlar.",

          educationReq:
            "Üniversitelerin Maden Mühendisliği lisans bölümünden mezun olmak.",

          experienceReq:
            "Tercihen açık ocak işletmeciliği, çimento hammaddeleri veya maden operasyonları alanlarında 2 yıla kadar deneyim.",

          certificates:
            "Mevzuat ve pozisyon gereklerine bağlı belgeler tercih sebebidir.",

          shiftSuitable: true,

          physicalReq:
            "Saha çalışmasına uygun olmak.",

          isgNotes:
            "Ocak sahalarında iş sağlığı ve güvenliği kurallarına uygun çalışabilmek.",

          cutoffScore: 50,
          normScore: 65,
          abilityDims:
            JSON.stringify([
              "SAYISAL",
              "SOZEL",
              "SOYUT",
              "DIKKAT",
            ]),

          isActive: true,
        },
      });

    console.log(
      "✓ Maden Mühendisi pozisyonu oluşturuldu."
    );
  } else {
    console.log(
      "✓ Maden Mühendisi pozisyonu zaten mevcut."
    );
  }

  // 3. Gerçek ilan
  const slug = "maden-muhendisi-adiyaman";

  const existingVacancy =
    await db.vacancy.findUnique({
      where: { slug },
    });

  if (existingVacancy) {
    console.log(
      "✓ Maden Mühendisi ilanı zaten mevcut."
    );
    return;
  }

  await db.vacancy.create({
    data: {
      slug,
      title: "Maden Mühendisi — Adıyaman",
      positionId: position.id,
      facilityId: facility.id,

      description:
        "Adıyaman Fabrikamızda, Maden ve Hammadde ekibimizin bir parçası olarak maden operasyonlarının güvenli, kaliteli ve planlı şekilde yürütülmesine katkı sağlayacak Maden Mühendisi ekip arkadaşı arıyoruz.\n\nİş Tanımı:\n• Maden üretim planlarının hazırlanmasına ve uygulanmasına destek vermek.\n• Dekapaj, delme-patlatma, kazı, yükleme, taşıma ve stoklama faaliyetlerini takip etmek.\n• Rezerv, hammadde kalitesi, üretim miktarı ve stok verilerini izleyerek raporlamak.\n• Ocak sahalarındaki çalışma alanlarını iş sağlığı ve güvenliği açısından kontrol etmek.\n• İş makineleri, taşıma araçları ve yüklenici faaliyetlerine ilişkin verimlilik süreçlerini takip etmek.\n• Ruhsat, izin, çevre, rehabilitasyon ve üretim süreçlerine ilişkin kayıtların hazırlanmasına destek vermek.",

      requirements:
        "• Üniversitelerin Maden Mühendisliği lisans bölümünden mezun olmak.\n• Tercihen açık ocak işletmeciliği, çimento hammaddeleri veya maden operasyonları alanlarında 2 yıla kadar deneyim sahibi olmak.\n• Açık ocak işletmeciliği, üretim planlama, delme-patlatma ve rezerv takibi konularında temel bilgi sahibi olmak.\n• Saha çalışmasına yatkın olmak ve seyahat engeli bulunmamak.\n• MS Office uygulamalarını etkin şekilde kullanabilmek.\n• Analitik düşünme, problem çözme ve raporlama becerilerine sahip olmak.\n• İş sağlığı ve güvenliği konusunda yüksek farkındalığa sahip, iletişimi güçlü ve ekip çalışmasına yatkın olmak.\n• Adıyaman'da ikamet eden veya edebilecek olmak.",

      status: "ACIK",
      publishedAt: new Date(),
    },
  });

  console.log(
    "✓ Maden Mühendisi ilanı oluşturuldu."
  );
  console.log(
    `  URL: /ilanlar/${slug}`
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