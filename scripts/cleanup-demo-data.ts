import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const KEEP_USER_EMAIL =
  "mutlu.canatar@cimko.com.tr";

const KEEP_CANDIDATE_EMAIL =
  "harettin@gmail.com";

const KEEP_VACANCY_SLUG =
  "maden-muhendisi-adiyaman";

async function main() {
  console.log("=== DEMO VERİ TEMİZLİĞİ ===");

  /*
   * KORUNACAK KAYITLAR
   */
  const keepUser = await db.user.findUnique({
    where: {
      email: KEEP_USER_EMAIL,
    },
  });

  if (!keepUser) {
    throw new Error(
      "Mutlu Canatar kullanıcısı bulunamadı. İşlem durduruldu."
    );
  }

  const keepCandidate =
    await db.candidate.findFirst({
      where: {
        email: KEEP_CANDIDATE_EMAIL,
        source: "GENEL_BASVURU",
      },
    });

  if (!keepCandidate) {
    throw new Error(
      "Korunacak Hayrettin Üstünsoy genel başvurusu bulunamadı. İşlem durduruldu."
    );
  }

  const keepVacancy =
    await db.vacancy.findUnique({
      where: {
        slug: KEEP_VACANCY_SLUG,
      },
    });

  if (!keepVacancy) {
    throw new Error(
      "Maden Mühendisi ilanı bulunamadı. İşlem durduruldu."
    );
  }

  /*
   * SİLİNECEK KAYITLAR
   */
  const usersToDelete =
    await db.user.findMany({
      where: {
        id: {
          not: keepUser.id,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

  const candidatesToDelete =
    await db.candidate.findMany({
      where: {
        id: {
          not: keepCandidate.id,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

  const vacanciesToDelete =
    await db.vacancy.findMany({
      where: {
        id: {
          not: keepVacancy.id,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

  console.log("\nKORUNACAK:");
  console.log(
    `✓ Kullanıcı: ${keepUser.firstName} ${keepUser.lastName} — ${keepUser.email}`
  );
  console.log(
    `✓ Aday: ${keepCandidate.firstName} ${keepCandidate.lastName} — ${keepCandidate.email}`
  );
  console.log(
    `✓ İlan: ${keepVacancy.title}`
  );

  console.log("\nSİLİNECEK:");
  console.log(
    `• Kullanıcı: ${usersToDelete.length}`
  );
  console.log(
    `• Aday: ${candidatesToDelete.length}`
  );
  console.log(
    `• İlan: ${vacanciesToDelete.length}`
  );

  console.log("\nDemo kullanıcılar:");
  for (const user of usersToDelete) {
    console.log(
      `  - ${user.firstName} ${user.lastName} (${user.email})`
    );
  }

  console.log("\nDemo/test adaylar:");
  for (const candidate of candidatesToDelete) {
    console.log(
      `  - ${candidate.firstName} ${candidate.lastName} (${candidate.email ?? "-"})`
    );
  }

  console.log("\nDemo ilanlar:");
  for (const vacancy of vacanciesToDelete) {
    console.log(
      `  - ${vacancy.title}`
    );
  }

  const candidateIds =
    candidatesToDelete.map(
      (candidate) => candidate.id
    );

  const userIds =
    usersToDelete.map(
      (user) => user.id
    );

  const vacancyIds =
    vacanciesToDelete.map(
      (vacancy) => vacancy.id
    );

  /*
   * Sayısal ön kontrol
   */
  const [
    assignmentCount,
    applicationCount,
    interviewCount,
    employeeCount,
  ] = await Promise.all([
    db.assignment.count({
      where: {
        candidateId: {
          in: candidateIds,
        },
      },
    }),

    db.application.count({
      where: {
        candidateId: {
          in: candidateIds,
        },
      },
    }),

    db.interview.count({
      where: {
        application: {
          candidateId: {
            in: candidateIds,
          },
        },
      },
    }),

    db.employee.count({
      where: {
        candidateId: {
          in: candidateIds,
        },
      },
    }),
  ]);

  console.log("\nBAĞLI KAYITLAR:");
  console.log(
    `• Sınav ataması: ${assignmentCount}`
  );
  console.log(
    `• Başvuru: ${applicationCount}`
  );
  console.log(
    `• Mülakat: ${interviewCount}`
  );
  console.log(
    `• Çalışana dönüşmüş aday: ${employeeCount}`
  );

  /*
   * TEMİZLİK
   */
  await db.$transaction(async (tx) => {
    /*
     * Candidate -> Employee cascade olmadığı için
     * önce candidate bağlantısını kaldırıyoruz.
     *
     * Çalışan kaydını SİLMİYORUZ.
     */
    if (candidateIds.length > 0) {
      await tx.employee.updateMany({
        where: {
          candidateId: {
            in: candidateIds,
          },
        },
        data: {
          candidateId: null,
        },
      });
    }

    /*
     * Demo ilanlara bağlı, korunacak adayın
     * olası başvurusu varsa vacancy bağlantısını
     * önce kaldır.
     */
    if (vacancyIds.length > 0) {
      await tx.application.updateMany({
        where: {
          vacancyId: {
            in: vacancyIds,
          },
          candidateId:
            keepCandidate.id,
        },
        data: {
          vacancyId: null,
          positionId: null,
        },
      });
    }

    /*
     * Demo adayları sil.
     *
     * Cascade sayesinde:
     * Application
     * StageHistory
     * Interview
     * Assignment
     * AssignmentTest
     * Answer
     * ConsentRecord
     * Document
     * ContactLog
     *
     * bağlı kayıtları da temizlenecek.
     */
    if (candidateIds.length > 0) {
      await tx.candidate.deleteMany({
        where: {
          id: {
            in: candidateIds,
          },
        },
      });
    }

    /*
     * Demo ilanları sil.
     */
    if (vacancyIds.length > 0) {
      await tx.vacancy.deleteMany({
        where: {
          id: {
            in: vacancyIds,
          },
        },
      });
    }

    /*
 * Demo kullanıcı referanslarını temizle.
 *
 * StageHistory ve AuditLog kayıtlarını
 * koruyoruz; yalnız kullanıcı bağlantısını
 * kaldırıyoruz.
 *
 * Demo kullanıcıların oluşturduğu
 * PerformanceEvaluation kayıtlarını siliyoruz.
 * Employee kayıtları korunuyor.
 */
if (userIds.length > 0) {
  // Süreç geçmişini koru, kullanıcı bağlantısını kaldır.
  await tx.stageHistory.updateMany({
    where: {
      userId: {
        in: userIds,
      },
    },
    data: {
      userId: null,
    },
  });

  // Audit geçmişini koru, kullanıcı bağlantısını kaldır.
  await tx.auditLog.updateMany({
    where: {
      userId: {
        in: userIds,
      },
    },
    data: {
      userId: null,
    },
  });

  // Demo kullanıcı bildirimlerini temizle.
  await tx.notification.deleteMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  /*
   * Demo kullanıcıların yaptığı performans
   * değerlendirmelerini sil.
   *
   * Employee kayıtları burada silinmez.
   */
  await tx.performanceEvaluation.deleteMany({
    where: {
      evaluatorId: {
        in: userIds,
      },
    },
  });

  /*
   * RESTRICT ilişkilerini kullanıcıları
   * silmeden hemen önce kontrol et.
   */
  const remainingInterviews =
    await tx.interview.count({
      where: {
        evaluatorId: {
          in: userIds,
        },
      },
    });

  const remainingEvaluations =
    await tx.performanceEvaluation.count({
      where: {
        evaluatorId: {
          in: userIds,
        },
      },
    });

  if (
    remainingInterviews > 0 ||
    remainingEvaluations > 0
  ) {
    throw new Error(
      `Demo kullanıcılar hâlâ RESTRICT ilişkilerinde kullanılıyor. Interview=${remainingInterviews}, PerformanceEvaluation=${remainingEvaluations}. İşlem geri alındı.`
    );
  }

  // Artık demo kullanıcıları güvenle silebiliriz.
  await tx.user.deleteMany({
    where: {
      id: {
        in: userIds,
      },
    },
  });
}
  });

  console.log(
    "\n✓ Temizlik başarıyla tamamlandı."
  );

  const [
    remainingUsers,
    remainingCandidates,
    remainingVacancies,
    remainingAssignments,
  ] = await Promise.all([
    db.user.findMany({
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    }),

    db.candidate.findMany({
      select: {
        firstName: true,
        lastName: true,
        email: true,
        source: true,
      },
    }),

    db.vacancy.findMany({
      select: {
        title: true,
        slug: true,
        status: true,
      },
    }),

    db.assignment.count(),
  ]);

  console.log("\nKALAN KULLANICILAR:");
  console.table(remainingUsers);

  console.log("\nKALAN ADAYLAR:");
  console.table(remainingCandidates);

  console.log("\nKALAN İLANLAR:");
  console.table(remainingVacancies);

  console.log(
    `\nKalan sınav ataması: ${remainingAssignments}`
  );
}

main()
  .catch((error) => {
    console.error("\nTEMİZLİK DURDURULDU:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });