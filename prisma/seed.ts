/* Çimko Platformu — örnek veri yükleme betiği
 * Çalıştırma: npm run db:seed
 * Not: Tüm kişiler kurgusaldır; gerçek kişisel veri içermez.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ABILITY_ITEMS } from "./seed-data/ability-items";
import {
  PERSONALITY_ITEMS,
  WELLBEING_ITEMS,
  DIMENSION_DESCRIPTIONS,
} from "./seed-data/personality-items";
import { COMPETENCIES, levelDefinitions } from "./seed-data/competencies";
import {
  scoreAbilityTest,
  scorePersonalityTest,
  scoreAttitudeTest,
} from "../src/lib/scoring";

const db = new PrismaClient();

// Deterministik sözde-rastgele üreteç (tekrarlanabilir örnek veri)
let seedState = 20260718;
function rand() {
  seedState = (seedState * 1103515245 + 12345) % 2147483648;
  return seedState / 2147483648;
}
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

const PDIMS = [
  "AGRESIFLIK",
  "DUYGUSAL_DENGE",
  "GIRISKENLIK",
  "KISISEL_UYUM",
  "KURALLARA_UYMA",
  "MUKEMMELIYETCILIK",
  "OTO_KONTROL",
  "RISK_ALMA",
  "SOSYALLIK",
  "YENILIGE_ACIKLIK",
] as const;

// PİK analizinden pozisyon ailesi bazlı kişilik aralıkları [min,max] × 10 boyut
const FAMILY_RANGES: Record<string, [number, number][]> = {
  URETIM: [[2,4],[8,10],[7,9],[7,9],[7,9],[5,9],[7,9],[2,5],[5,9],[5,9]],
  ILK_SEVIYE: [[2,5],[7,10],[4,9],[7,9],[5,9],[5,9],[6,9],[1,5],[3,9],[3,9]],
  BAKIM: [[2,4],[7,10],[6,9],[6,9],[7,9],[6,9],[5,9],[2,4],[2,9],[6,9]],
  KALITE: [[2,4],[7,10],[6,9],[6,9],[8,10],[7,10],[6,9],[2,4],[4,9],[5,9]],
  SEVKIYAT: [[2,4],[8,10],[2,8],[7,9],[7,9],[4,8],[7,10],[2,4],[2,9],[3,6]],
  HAZIR_BETON: [[1,5],[8,10],[5,10],[5,10],[6,10],[5,9],[7,10],[1,5],[3,9],[3,9]],
};

const CORE_DIMS = JSON.stringify(["SAYISAL", "SOZEL", "SOYUT", "DIKKAT"]);
const TECH_DIMS = JSON.stringify(["SAYISAL", "SOZEL", "SOYUT", "DIKKAT", "MEKANIK"]);

async function main() {
  console.log("→ Mevcut veriler temizleniyor...");
  // FK sırasına göre temizlik
  const tables = [
    "answer","assignmentTest","assignment","interview","stageHistory","application",
    "vacancy","consentRecord","document","contactLog","performanceEvaluation",
    "performancePeriod","employee","testItem","testSection","examPackageTest",
    "examPackage","testForm","item","stimulusGroup","positionCompetency",
    "positionPersonalityRange","scoreWeight","candidate","competency","position",
    "department","user","facility","personalityDimension","auditLog","notification",
  ] as const;
  for (const t of tables) {
    // @ts-expect-error dinamik model erişimi
    await db[t].deleteMany({});
  }

  // ── Kişilik boyutları ─────────────────────────────────────────
  console.log("→ Kişilik boyutları...");
  const dimByCode = new Map<string, string>();
  for (let i = 0; i < PDIMS.length; i++) {
    const code = PDIMS[i];
    const names: Record<string, string> = {
      AGRESIFLIK: "Agresiflik", DUYGUSAL_DENGE: "Duygusal Denge",
      GIRISKENLIK: "Girişkenlik", KISISEL_UYUM: "Kişisel Uyum",
      KURALLARA_UYMA: "Kurallara Uyma", MUKEMMELIYETCILIK: "Mükemmeliyetçilik",
      OTO_KONTROL: "Oto Kontrol", RISK_ALMA: "Risk Alma",
      SOSYALLIK: "Sosyallik", YENILIGE_ACIKLIK: "Yeniliğe Açıklık",
    };
    const d = await db.personalityDimension.create({
      data: {
        code,
        name: names[code],
        description: DIMENSION_DESCRIPTIONS[code] ?? "",
        order: i,
      },
    });
    dimByCode.set(code, d.id);
  }

  // ── Yetkinlikler ──────────────────────────────────────────────
  console.log("→ Yetkinlik kütüphanesi (23)...");
  const competencyIds: string[] = [];
  for (const c of COMPETENCIES) {
    const created = await db.competency.create({
      data: {
        name: c.name,
        category: c.category,
        description: c.description,
        positiveIndicators: JSON.stringify(c.positive),
        negativeIndicators: JSON.stringify(c.negative),
        levelDefinitions: JSON.stringify(levelDefinitions),
      },
    });
    competencyIds.push(created.id);
  }

  // ── Organizasyon ──────────────────────────────────────────────
  console.log("→ Organizasyon yapısı...");
  const adiyaman = await db.facility.create({
    data: { name: "Adıyaman Çimento Fabrikası", type: "CIMENTO_FABRIKASI", city: "Adıyaman" },
  });
  const narli = await db.facility.create({
    data: { name: "Narlı Çimento Fabrikası", type: "CIMENTO_FABRIKASI", city: "Kahramanmaraş" },
  });
  const beton = await db.facility.create({
    data: { name: "Gaziantep Hazır Beton Tesisi", type: "HAZIR_BETON_TESISI", city: "Gaziantep" },
  });

  const dep = async (facilityId: string, name: string) =>
    db.department.create({ data: { facilityId, name } });

  const dUretimA = await dep(adiyaman.id, "Üretim");
  const dBakimA = await dep(adiyaman.id, "Bakım");
  const dKaliteA = await dep(adiyaman.id, "Kalite Kontrol ve Ar-Ge");
  const dLojistikA = await dep(adiyaman.id, "Depo ve Sevkiyat");
  const dUretimN = await dep(narli.id, "Üretim");
  const dBakimN = await dep(narli.id, "Bakım");
  const dBetonUretim = await dep(beton.id, "Beton Üretim");

  // ── Pozisyonlar + profiller ───────────────────────────────────
  console.log("→ Pozisyonlar ve ölçüm profilleri...");
  type PosDef = {
    name: string; depId: string; family: string; profile: string;
    norm: number; dims: string; education?: string; experience?: string; certificates?: string;
  };
  const POSITIONS: PosDef[] = [
    { name: "Üretim Operatörü", depId: dUretimA.id, family: "URETIM", profile: "URETIM", norm: 65, dims: CORE_DIMS, education: "Meslek lisesi (tercihen elektrik/makine)", experience: "2 yıl üretim deneyimi" },
    { name: "Saha Operatörü", depId: dUretimA.id, family: "URETIM", profile: "URETIM", norm: 65, dims: CORE_DIMS, education: "Lise", experience: "Deneyim aranmaz" },
    { name: "Paketleme Operatörü", depId: dUretimA.id, family: "URETIM", profile: "ILK_SEVIYE", norm: 60, dims: CORE_DIMS, education: "İlköğretim", experience: "Deneyim aranmaz" },
    { name: "Enerji Operatörü", depId: dUretimN.id, family: "URETIM", profile: "URETIM", norm: 65, dims: TECH_DIMS, education: "Meslek lisesi (elektrik)", certificates: "EKAT belgesi" },
    { name: "Vardiya Ustası", depId: dUretimN.id, family: "URETIM", profile: "URETIM", norm: 65, dims: TECH_DIMS, education: "Meslek lisesi / MYO", experience: "5 yıl üretim, 2 yıl ekip liderliği" },
    { name: "Mekanik Bakım Teknisyeni", depId: dBakimA.id, family: "BAKIM", profile: "BAKIM", norm: 65, dims: TECH_DIMS, education: "Meslek lisesi (makine)", experience: "3 yıl bakım deneyimi", certificates: "Kaynakçılık sertifikası tercih sebebi" },
    { name: "Elektrik Bakım Teknisyeni", depId: dBakimN.id, family: "BAKIM", profile: "BAKIM", norm: 65, dims: TECH_DIMS, education: "Meslek lisesi (elektrik)", experience: "3 yıl bakım deneyimi", certificates: "EKAT belgesi zorunlu" },
    { name: "Laboratuvar Teknisyeni", depId: dKaliteA.id, family: "KALITE", profile: "KALITE", norm: 65, dims: CORE_DIMS, education: "Meslek lisesi (kimya) / MYO", experience: "1 yıl laboratuvar deneyimi" },
    { name: "Kalite Kontrol Operatörü", depId: dKaliteA.id, family: "KALITE", profile: "KALITE", norm: 65, dims: CORE_DIMS, education: "Lise", experience: "Deneyim aranmaz" },
    { name: "Forklift Operatörü", depId: dLojistikA.id, family: "LOJISTIK", profile: "SEVKIYAT", norm: 60, dims: TECH_DIMS, education: "İlköğretim", certificates: "Forklift operatör belgesi zorunlu" },
    { name: "Sevkiyat Operatörü", depId: dLojistikA.id, family: "LOJISTIK", profile: "SEVKIYAT", norm: 60, dims: TECH_DIMS, education: "Lise" },
    { name: "İş Makinesi Operatörü", depId: dBetonUretim.id, family: "HAZIR_BETON", profile: "HAZIR_BETON", norm: 65, dims: TECH_DIMS, education: "İlköğretim", certificates: "G sınıfı ehliyet / operatörlük belgesi" },
  ];

  const positionIds = new Map<string, string>();
  for (const p of POSITIONS) {
    const pos = await db.position.create({
      data: {
        departmentId: p.depId,
        name: p.name,
        jobFamily: p.family,
        educationReq: p.education ?? "",
        experienceReq: p.experience ?? "",
        certificates: p.certificates ?? "",
        cutoffScore: 50,
        normScore: p.norm,
        abilityDims: p.dims,
        description: `${p.name} pozisyonu; vardiyalı çalışma düzenine ve saha koşullarına uygunluk gerektirir.`,
        isgNotes: "KKD kullanımı zorunludur. Yüksekte çalışma ve kapalı alan prosedürleri geçerlidir.",
      },
    });
    positionIds.set(p.name, pos.id);

    const ranges = FAMILY_RANGES[p.profile];
    for (let i = 0; i < PDIMS.length; i++) {
      await db.positionPersonalityRange.create({
        data: {
          positionId: pos.id,
          dimensionId: dimByCode.get(PDIMS[i])!,
          minValue: ranges[i][0],
          maxValue: ranges[i][1],
        },
      });
    }

    // Örnek yetkinlik eşlemesi: her pozisyona 6 yetkinlik
    const coreComp = [0, 1, 3, 5, 11, 20]; // İSG, Prosedür, Disiplin, Teknik, Takım, Riskleri Fark Etme
    for (let i = 0; i < coreComp.length; i++) {
      await db.positionCompetency.create({
        data: {
          positionId: pos.id,
          competencyId: competencyIds[coreComp[i]],
          expectedLevel: i < 2 ? 4 : 3,
          weight: i < 2 ? 20 : 15,
        },
      });
    }
  }

  // Genel varsayılan ağırlık seti
  await db.scoreWeight.create({
    data: {
      positionId: null,
      abilityWeight: 35, personalityWeight: 20, ikInterviewWeight: 15,
      techInterviewWeight: 15, practicalWeight: 10, isgWeight: 5,
    },
  });

  // ── Soru bankası ──────────────────────────────────────────────
  console.log("→ Soru bankası (özgün maddeler)...");
  const abilityItemIds: Record<string, string[]> = {
    SAYISAL: [], SOZEL: [], SOYUT: [], DIKKAT: [], MEKANIK: [],
  };
  for (const q of ABILITY_ITEMS) {
    const item = await db.item.create({
      data: {
        type: "COKTAN_SECMELI",
        text: q.text,
        dimension: q.dimension,
        options: JSON.stringify(q.options),
        correctKey: q.correctKey,
        difficulty: q.difficulty ?? "ORTA",
      },
    });
    abilityItemIds[q.dimension].push(item.id);
  }

  const personalityBySection: Record<number, string[]> = { 1: [], 2: [], 3: [] };
  for (const q of PERSONALITY_ITEMS) {
    const item = await db.item.create({
      data: {
        type: q.type,
        text: q.text,
        personalityDimId: dimByCode.get(q.dim)!,
        direction: q.direction ?? 1,
        options: JSON.stringify(
          q.options ??
            (q.type === "LIKERT3"
              ? [
                  { key: "0", text: "Katılmıyorum" },
                  { key: "1", text: "Biraz Katılıyorum" },
                  { key: "2", text: "Katılıyorum" },
                ]
              : [
                  { key: "0", text: "Bana uymuyor" },
                  { key: "1", text: "Bana uyuyor" },
                ])
        ),
        correctKey: q.correctKey ?? null,
      },
    });
    personalityBySection[q.section].push(item.id);
  }

  const wellbeingIds: string[] = [];
  for (const q of WELLBEING_ITEMS) {
    const item = await db.item.create({
      data: {
        type: "LIKERT3",
        text: q.text,
        dimension: "TUTUM",
        options: JSON.stringify([
          { key: "0", text: "Katılmıyorum" },
          { key: "1", text: "Kısmen Katılıyorum" },
          { key: "2", text: "Katılıyorum" },
        ]),
      },
    });
    wellbeingIds.push(item.id);
  }

  // ── Test formları ─────────────────────────────────────────────
  console.log("→ Test formları...");
  async function createAbilityForm(name: string, code: string, dims: string[], perDim: Record<string, number>) {
    const form = await db.testForm.create({
      data: { name, code, kind: "YETENEK", description: "Sayısal, sözel, soyut kavrama ve görsel dikkat (pozisyona göre mekanik kavrama) alt boyutlarını ölçer. 25 dakika, yanlış doğruyu götürmez." },
    });
    const section = await db.testSection.create({
      data: {
        testFormId: form.id, name: "Genel Yetenek", order: 0, durationMin: 25,
        allowSkip: true, shuffle: false,
        instruction: "Her sorunun tek doğru cevabı vardır. Yanlış cevap puan götürmez; yapamadığınız soruyu boş bırakabilir, süreniz kalırsa geri dönebilirsiniz.",
      },
    });
    let order = 0;
    for (const d of dims) {
      const ids = abilityItemIds[d].slice(0, perDim[d] ?? abilityItemIds[d].length);
      for (const itemId of ids) {
        await db.testItem.create({ data: { sectionId: section.id, itemId, order: order++ } });
      }
    }
    return form;
  }

  const gyUretim = await createAbilityForm(
    "Genel Yetenek Testi — Üretim", "GY-URT",
    ["SAYISAL", "SOZEL", "SOYUT", "DIKKAT"],
    { SAYISAL: 10, SOZEL: 10, SOYUT: 10, DIKKAT: 10 }
  );
  const gyTeknik = await createAbilityForm(
    "Genel Yetenek Testi — Teknik", "GY-TEK",
    ["SAYISAL", "SOZEL", "SOYUT", "DIKKAT", "MEKANIK"],
    { SAYISAL: 8, SOZEL: 8, SOYUT: 8, DIKKAT: 8, MEKANIK: 8 }
  );

  const cke = await db.testForm.create({
    data: {
      name: "ÇKE — Çimko Kişilik Envanteri", code: "CKE-01", kind: "KISILIK",
      description: "Çalışma ortamındaki kişilik eğilimlerini 10 boyutta değerlendirir. Doğru ya da yanlış cevap yoktur; içten yanıtlar en sağlıklı sonucu verir.",
    },
  });
  const ckeSections = [
    { name: "Bölüm 1 — İfadeler", durationMin: 12, instruction: "Her ifadenin size ne ölçüde uyduğunu işaretleyin. Soru atlanamaz." },
    { name: "Bölüm 2 — Sıfatlar", durationMin: 5, instruction: "Her sıfatın size uyup uymadığını işaretleyin. Soru atlanamaz." },
    { name: "Bölüm 3 — Seçimler", durationMin: 6, instruction: "Her maddede size daha çok uyan seçeneği işaretleyin. Soru atlanamaz." },
  ];
  for (let s = 0; s < 3; s++) {
    const section = await db.testSection.create({
      data: {
        testFormId: cke.id, name: ckeSections[s].name, order: s,
        durationMin: ckeSections[s].durationMin, allowSkip: false,
        instruction: ckeSections[s].instruction,
      },
    });
    const ids = personalityBySection[(s + 1) as 1 | 2 | 3];
    for (let i = 0; i < ids.length; i++) {
      await db.testItem.create({ data: { sectionId: section.id, itemId: ids[i], order: i } });
    }
  }

  const wellbeing = await db.testForm.create({
    data: {
      name: "Çalışma Yaşamı İyi Oluş Ölçeği", code: "CIO-01", kind: "TUTUM",
      description: "Genel iyi oluş düzeyine ilişkin kısa taramadır. Sonuçlar yalnızca yetkili İK tarafından görülebilir ve işe uygunluk puanına katılmaz.",
    },
  });
  const wbSection = await db.testSection.create({
    data: {
      testFormId: wellbeing.id, name: "İfadeler", order: 0, durationMin: 8,
      allowSkip: false,
      instruction: "Son iki haftanızı düşünerek her ifadeye katılım düzeyinizi işaretleyin.",
    },
  });
  for (let i = 0; i < wellbeingIds.length; i++) {
    await db.testItem.create({ data: { sectionId: wbSection.id, itemId: wellbeingIds[i], order: i } });
  }

  // ── Sınav paketleri ───────────────────────────────────────────
  console.log("→ Sınav paketleri...");
  async function pkg(name: string, testIds: string[]) {
    const p = await db.examPackage.create({ data: { name } });
    for (let i = 0; i < testIds.length; i++) {
      await db.examPackageTest.create({
        data: { examPackageId: p.id, testFormId: testIds[i], order: i },
      });
    }
    return p;
  }
  const pkgUretim = await pkg("Üretim Operatörü Sınav Uygulaması", [cke.id, gyUretim.id]);
  const pkgBakim = await pkg("Bakım Personeli Sınav Uygulaması", [cke.id, gyTeknik.id]);
  const pkgKalite = await pkg("Kalite Kontrol Sınav Uygulaması", [cke.id, gyUretim.id]);
  await pkg("Depo ve Sevkiyat Sınav Uygulaması", [cke.id, gyTeknik.id]);

  // ── Kullanıcılar ──────────────────────────────────────────────
  console.log("→ Kullanıcılar...");
  const hash = await bcrypt.hash("Cimko2026!", 10);
  const mkUser = (email: string, firstName: string, lastName: string, role: string, facilityId?: string, departmentId?: string) =>
    db.user.create({ data: { email, passwordHash: hash, firstName, lastName, role, facilityId, departmentId } });

  await mkUser("admin@cimko.com.tr", "Sistem", "Yöneticisi", "SISTEM_YONETICISI");
  const ikYon = await mkUser("ik.yonetici@cimko.com.tr", "Elif", "Kaya", "IK_YONETICISI");
  const ikUzm = await mkUser("ik.uzman@cimko.com.tr", "Murat", "Demir", "IK_UZMANI");
  await mkUser("tesis.adiyaman@cimko.com.tr", "Ahmet", "Yılmaz", "TESIS_YONETICISI", adiyaman.id);
  const bolumYon = await mkUser("bolum.uretim@cimko.com.tr", "Hasan", "Çelik", "BOLUM_YONETICISI", adiyaman.id, dUretimA.id);
  const teknik = await mkUser("teknik.degerlendirici@cimko.com.tr", "Zeynep", "Arslan", "TEKNIK_DEGERLENDIRICI", adiyaman.id);
  await mkUser("isg.uzman@cimko.com.tr", "Fatma", "Şahin", "ISG_UZMANI", adiyaman.id);
  // Kurum dışından yetkilendirilen kullanıcı: yalnızca Açık Pozisyonlar ekranına erişir
  await mkUser("dis.kullanici@tedarikci.com.tr", "Selin", "Aydın", "DIS_KULLANICI");

  // ── İlanlar ───────────────────────────────────────────────────
  console.log("→ Açık pozisyon ilanları...");
  const vac1 = await db.vacancy.create({
    data: {
      slug: "uretim-operatoru-adiyaman",
      title: "Üretim Operatörü — Adıyaman",
      positionId: positionIds.get("Üretim Operatörü")!,
      facilityId: adiyaman.id,
      description: "Adıyaman Çimento Fabrikamızın döner fırın ve değirmen hatlarında vardiyalı düzende görev alacak Üretim Operatörü arıyoruz.",
      requirements: "Meslek lisesi mezunu, tercihen üretim tesisi deneyimli, vardiyalı çalışmaya uygun, askerlik hizmetini tamamlamış.",
      status: "ACIK", publishedAt: new Date("2026-07-01"),
    },
  });
  const vac2 = await db.vacancy.create({
    data: {
      slug: "mekanik-bakim-teknisyeni-adiyaman",
      title: "Mekanik Bakım Teknisyeni — Adıyaman",
      positionId: positionIds.get("Mekanik Bakım Teknisyeni")!,
      facilityId: adiyaman.id,
      description: "Fabrikamızın mekanik bakım ekibinde görev alacak, kestirimci bakım süreçlerine katkı sağlayacak teknisyen arıyoruz.",
      requirements: "Makine bölümü meslek lisesi mezunu, en az 3 yıl endüstriyel bakım deneyimi, kaynak sertifikası tercih sebebi.",
      status: "ACIK", publishedAt: new Date("2026-07-05"),
    },
  });
  await db.vacancy.create({
    data: {
      slug: "forklift-operatoru-adiyaman",
      title: "Forklift Operatörü — Adıyaman",
      positionId: positionIds.get("Forklift Operatörü")!,
      facilityId: adiyaman.id,
      description: "Depo ve sevkiyat operasyonlarında görev alacak belgeli forklift operatörü arıyoruz.",
      requirements: "Forklift operatör belgesi zorunlu, vardiyalı çalışmaya uygun.",
      status: "ACIK", publishedAt: new Date("2026-07-10"),
    },
  });

  // ── Adaylar + başvurular ──────────────────────────────────────
  console.log("→ Örnek adaylar ve başvurular...");
  const CANDS = [
    ["Kemal", "Aydın", "uretim", vac1.id, "TEST_TAMAMLANDI"],
    ["Serkan", "Koç", "uretim", vac1.id, "IK_MULAKATI"],
    ["Hüseyin", "Polat", "uretim", vac1.id, "TEST_BEKLIYOR"],
    ["Emre", "Güneş", "uretim", vac1.id, "YENI_BASVURU"],
    ["Ayşe", "Kurt", "uretim", vac1.id, "ON_INCELEME"],
    ["Mehmet", "Özdemir", "bakim", vac2.id, "TEST_TAMAMLANDI"],
    ["Mustafa", "Erdoğan", "bakim", vac2.id, "TEKNIK_MULAKAT"],
    ["Ali", "Yıldız", "bakim", vac2.id, "YENI_BASVURU"],
    ["Osman", "Kara", "forklift", null, "TELEFON_GORUSMESI"],
    ["Ramazan", "Tekin", "kalite", null, "TEST_BEKLIYOR"],
  ] as const;

  const posByKey: Record<string, string> = {
    uretim: positionIds.get("Üretim Operatörü")!,
    bakim: positionIds.get("Mekanik Bakım Teknisyeni")!,
    forklift: positionIds.get("Forklift Operatörü")!,
    kalite: positionIds.get("Kalite Kontrol Operatörü")!,
  };
  const pkgByKey: Record<string, string> = {
    uretim: pkgUretim.id, bakim: pkgBakim.id, forklift: pkgBakim.id, kalite: pkgKalite.id,
  };

  const educationPool = ["ILKOKUL", "ORTAOKUL", "LISE", "MESLEK_LISESI"];
  const applications: { appId: string; candidateId: string; key: string; stage: string; firstName: string; lastName: string }[] = [];

  for (let i = 0; i < CANDS.length; i++) {
    const [firstName, lastName, key, vacancyId, stage] = CANDS[i];
    const cand = await db.candidate.create({
      data: {
        firstName, lastName,
        nationalId: String(10000000000 + i * 1111111),
        phone: `05${300 + i} ${100 + i} ${10 + i} ${20 + i}`,
        email: i % 3 === 0 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ornek.com` : null,
        gender: ["Ayşe", "Fatma"].includes(firstName as string) ? "KADIN" : "ERKEK",
        birthDate: new Date(1988 + (i % 12), i % 12, 5 + i),
        educationLevel: pick([...educationPool]),
        city: pick(["Adıyaman", "Kahramanmaraş", "Gaziantep"]),
        source: vacancyId ? "ILAN_BASVURU" : "IK_KAYIT",
        militaryStatus: "YAPILDI",
      },
    });
    await db.consentRecord.create({
      data: { candidateId: cand.id, kind: "KVKK_BASVURU", textVersion: "v1.0-2026" },
    });
    const app = await db.application.create({
      data: {
        candidateId: cand.id,
        positionId: posByKey[key],
        vacancyId: vacancyId ?? undefined,
        stage,
        appliedAt: new Date(2026, 6, 2 + i),
      },
    });
    await db.stageHistory.create({
      data: {
        applicationId: app.id, fromStage: "", toStage: "YENI_BASVURU",
        userId: ikUzm.id, note: "Başvuru alındı",
      },
    });
    if (stage !== "YENI_BASVURU") {
      await db.stageHistory.create({
        data: {
          applicationId: app.id, fromStage: "YENI_BASVURU", toStage: stage,
          userId: ikUzm.id, note: "Süreç ilerletildi",
        },
      });
    }
    applications.push({ appId: app.id, candidateId: cand.id, key, stage, firstName, lastName });
  }

  // ── Sınav atamaları + tamamlanmış örnek sonuçlar ──────────────
  console.log("→ Sınav atamaları ve örnek sonuçlar...");

  function accessCode(i: number) {
    const chars = "ABCDEFGHJKLMNPRSTUVYZ23456789";
    let s = "";
    for (let k = 0; k < 2; k++) s += chars[Math.floor(rand() * chars.length)];
    s += "-";
    for (let k = 0; k < 4; k++) s += chars[Math.floor(rand() * chars.length)];
    return `${s}${i}`;
  }

  for (let i = 0; i < applications.length; i++) {
    const a = applications[i];
    const needsAssignment = ["TEST_BEKLIYOR", "TEST_TAMAMLANDI", "IK_MULAKATI", "TEKNIK_MULAKAT"].includes(a.stage);
    if (!needsAssignment) continue;

    const assignment = await db.assignment.create({
      data: {
        candidateId: a.candidateId,
        examPackageId: pkgByKey[a.key],
        accessCode: accessCode(i),
        positionId: posByKey[a.key],
        kvkkAccepted: a.stage !== "TEST_BEKLIYOR",
      },
    });

    const pkgTests = await db.examPackageTest.findMany({
      where: { examPackageId: pkgByKey[a.key] },
      include: { testForm: { include: { sections: { include: { items: { include: { item: true } } } } } } },
      orderBy: { order: "asc" },
    });

    for (const pt of pkgTests) {
      const completed = a.stage !== "TEST_BEKLIYOR";
      const allItems = pt.testForm.sections.flatMap((s) => s.items.map((ti) => ti.item));

      const at = await db.assignmentTest.create({
        data: {
          assignmentId: assignment.id,
          testFormId: pt.testFormId,
          status: completed ? "TAMAMLANDI" : "BASLAMADI",
          startedAt: completed ? new Date(2026, 6, 8 + i, 10, 0) : null,
          completedAt: completed ? new Date(2026, 6, 8 + i, 10, 40) : null,
        },
      });

      if (!completed) continue;

      // Cevapları simüle et (aday başarımı %50-85 bandında)
      const skill = 0.5 + rand() * 0.35;
      const answers: { itemId: string; selectedKey: string | null; isCorrect: boolean | null }[] = [];
      for (const item of allItems) {
        const opts = JSON.parse(item.options) as { key: string }[];
        let selectedKey: string | null = null;
        if (item.type === "COKTAN_SECMELI") {
          if (rand() < 0.06) selectedKey = null; // boş bırakma
          else if (rand() < skill) selectedKey = item.correctKey;
          else selectedKey = pick(opts.filter((o) => o.key !== item.correctKey)).key;
        } else {
          selectedKey = pick(opts).key;
        }
        answers.push({
          itemId: item.id,
          selectedKey,
          isCorrect: item.correctKey ? selectedKey === item.correctKey : null,
        });
        if (selectedKey != null) {
          await db.answer.create({
            data: { assignmentTestId: at.id, itemId: item.id, selectedKey, isCorrect: item.correctKey ? selectedKey === item.correctKey : null },
          });
        }
      }

      // Puanla
      const itemLikes = allItems.map((it) => ({
        id: it.id, type: it.type, dimension: it.dimension,
        personalityDimId: it.personalityDimId, direction: it.direction,
        correctKey: it.correctKey, options: it.options,
      }));

      const position = await db.position.findUnique({
        where: { id: posByKey[a.key] },
        include: { personalityRanges: { include: { dimension: true } } },
      });

      let totalScore = 0;
      let resultJson = "{}";
      if (pt.testForm.kind === "YETENEK") {
        const res = scoreAbilityTest(itemLikes, answers, position!.cutoffScore, position!.normScore);
        totalScore = res.totalScore;
        resultJson = JSON.stringify(res);
      } else if (pt.testForm.kind === "KISILIK") {
        const ranges = position!.personalityRanges.map((r) => ({
          dimensionId: r.dimensionId, code: r.dimension.code, name: r.dimension.name,
          minValue: r.minValue, maxValue: r.maxValue,
        }));
        const dimNames = new Map(position!.personalityRanges.map((r) => [r.dimensionId, { code: r.dimension.code, name: r.dimension.name }]));
        const res = scorePersonalityTest(itemLikes, answers, ranges, dimNames);
        totalScore = res.fitPercent ?? 0;
        resultJson = JSON.stringify(res);
      } else {
        const res = scoreAttitudeTest(itemLikes, answers);
        totalScore = res.totalScore;
        resultJson = JSON.stringify(res);
      }

      await db.assignmentTest.update({
        where: { id: at.id },
        data: { totalScore, resultJson },
      });
    }
  }

  // ── Mülakat örnekleri ─────────────────────────────────────────
  console.log("→ Örnek mülakat değerlendirmeleri...");
  const mulakatApp = applications.find((a) => a.stage === "IK_MULAKATI");
  if (mulakatApp) {
    await db.interview.create({
      data: {
        applicationId: mulakatApp.appId, type: "IK_MULAKAT", evaluatorId: ikYon.id,
        status: "TAMAMLANDI", completedAt: new Date(2026, 6, 12),
        overallScore: 4.0, recommendation: "OLUMLU",
        scoresJson: JSON.stringify([
          { criterion: "İletişim ve ifade", score: 4, comment: "Kendini açık ifade etti" },
          { criterion: "Vardiya ve saha uygunluğu", score: 4, comment: "" },
          { criterion: "Motivasyon ve istikrar", score: 4, comment: "Uzun süreli çalışma hedefliyor" },
        ]),
        comments: "Pozisyon beklentileriyle uyumlu, teknik mülakata yönlendirildi.",
      },
    });
  }
  const teknikApp = applications.find((a) => a.stage === "TEKNIK_MULAKAT");
  if (teknikApp) {
    await db.interview.create({
      data: {
        applicationId: teknikApp.appId, type: "TEKNIK_MULAKAT", evaluatorId: teknik.id,
        status: "PLANLANDI", scheduledAt: new Date(2026, 6, 20, 14, 0),
      },
    });
  }

  // ── Çalışanlar + performans dönemi (faz 2 iskeleti) ───────────
  console.log("→ Örnek çalışanlar ve performans dönemi...");
  const employees = [
    ["1001", "Veli", "Şimşek", "Üretim Operatörü"],
    ["1002", "İbrahim", "Aksoy", "Mekanik Bakım Teknisyeni"],
    ["1003", "Halil", "Doğan", "Forklift Operatörü"],
  ] as const;
  const period = await db.performancePeriod.create({
    data: { name: "2026 Yıl Ortası Değerlendirme", startDate: new Date("2026-06-01"), endDate: new Date("2026-08-31"), status: "ACIK" },
  });
  for (const [sicil, fn, ln, posName] of employees) {
    const emp = await db.employee.create({
      data: {
        sicilNo: sicil, firstName: fn, lastName: ln,
        positionId: positionIds.get(posName)!,
        facilityId: adiyaman.id,
        hireDate: new Date("2025-03-01"), status: "KADROLU",
      },
    });
    if (sicil === "1001") {
      const posComp = await db.positionCompetency.findMany({
        where: { positionId: positionIds.get(posName)! },
        include: { competency: true },
      });
      await db.performanceEvaluation.create({
        data: {
          periodId: period.id, employeeId: emp.id, evaluatorId: bolumYon.id,
          type: "AMIR", status: "TAMAMLANDI", totalScore: 3.6,
          completedAt: new Date("2026-07-10"),
          scoresJson: JSON.stringify(posComp.map((pc, idx) => ({
            competencyId: pc.competencyId, name: pc.competency.name,
            expectedLevel: pc.expectedLevel, score: [4, 4, 3, 4, 3, 4][idx % 6],
            note: "",
          }))),
          comments: "Genel performansı beklentilerin üzerinde; bakım farkındalığı gelişim alanı.",
        },
      });
    }
  }

  await db.auditLog.create({
    data: { actorType: "SYSTEM", action: "SEED", entity: "System", detail: "Örnek veri yüklendi" },
  });

  console.log("✓ Seed tamamlandı.");
  console.log("  Giriş hesapları (şifre: Cimko2026!):");
  console.log("   admin@cimko.com.tr · ik.yonetici@cimko.com.tr · ik.uzman@cimko.com.tr");
  console.log("   tesis.adiyaman@ · bolum.uretim@ · teknik.degerlendirici@ · isg.uzman@cimko.com.tr");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
