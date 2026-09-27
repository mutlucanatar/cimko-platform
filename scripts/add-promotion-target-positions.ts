import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const targets = [
  {
    sourceName: "Elektrik Bakım Elemanı",
    targetName: "Elektrik Bakım Ustası",
  },
  {
    sourceName: "Mekanik Bakım Elemanı",
    targetName: "Mekanik Bakım Ustası",
  },
  {
    sourceName: "Laboratuvar İşçisi",
    targetName: "Laborant",
  },
];

async function main() {
  console.log("→ Terfi hedef pozisyonları oluşturuluyor...");

  for (const target of targets) {
    const existing = await db.position.findFirst({
      where: {
        name: target.targetName,
      },
    });

    if (existing) {
      console.log(
        `  Zaten mevcut: ${target.targetName}`
      );
      continue;
    }

    const source = await db.position.findFirst({
      where: {
        name: target.sourceName,
      },
    });

    if (!source) {
      throw new Error(
        `Kaynak pozisyon bulunamadı: ${target.sourceName}`
      );
    }

    const created = await db.position.create({
      data: {
        departmentId: source.departmentId,
        name: target.targetName,
        jobFamily: source.jobFamily,
        description: source.description,
        educationReq: source.educationReq,
        experienceReq: source.experienceReq,
        certificates: source.certificates,
        shiftSuitable: source.shiftSuitable,
        physicalReq: source.physicalReq,
        isgNotes: source.isgNotes,
        isActive: true,
        cutoffScore: 50,
        normScore: 65,
        abilityDims: source.abilityDims,
      },
    });

    console.log(
      `✓ ${created.name} oluşturuldu.`
    );
  }

  console.log("✓ Tamamlandı.");
}

main()
  .catch((error) => {
    console.error("HATA:", error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });