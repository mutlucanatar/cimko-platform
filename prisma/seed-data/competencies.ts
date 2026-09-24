export type CompetencySeed = {
  name: string;
  category: string;
  description: string;
  positive: string[];
  negative: string[];
};

export type LevelDefinition = {
  level: number;
  text: string;
};

export const COMPETENCIES: CompetencySeed[] = [
  {
    "name": "İş Sağlığı ve Güvenliği Bilinci",
    "category": "ISG",
    "description": "İSG kurallarını bilir, uygular ve riskli davranışlardan kaçınır.",
    "positive": [
      "KKD'yi eksiksiz kullanır",
      "Güvensiz durumu amirine bildirir",
      "İzin gerektiren işlerde prosedürü bekler"
    ],
    "negative": [
      "KKD'siz sahaya çıkar",
      "Emniyet kilitlerini devre dışı bırakır",
      "Kestirme yollara başvurur"
    ]
  },
  {
    "name": "Prosedür ve Talimatlara Uyum",
    "category": "ISG",
    "description": "İş talimatlarını eksiksiz izler, onaysız değişiklik yapmaz.",
    "positive": [
      "Talimat adımlarını sırasıyla uygular",
      "Tereddütte amire danışır"
    ],
    "negative": [
      "Adım atlar",
      "Kendi yöntemiyle çalışır"
    ]
  },
  {
    "name": "Kalite Odaklılık",
    "category": "KALITE",
    "description": "İşin ilk seferde doğru ve standartlara uygun yapılmasını gözetir.",
    "positive": [
      "Spesifikasyon dışı durumu raporlar",
      "Kontrol adımlarını atlamaz"
    ],
    "negative": [
      "Hatalı ürünü görmezden gelir",
      "Kontrolsüz teslim eder"
    ]
  },
  {
    "name": "İş Disiplini",
    "category": "DAVRANISSAL",
    "description": "Mesai, kural ve görev sorumluluklarına bağlıdır.",
    "positive": [
      "Vardiyaya zamanında gelir",
      "Görev alanını izinsiz terk etmez"
    ],
    "negative": [
      "Geç kalma alışkanlığı",
      "İzinsiz alan terki"
    ]
  },
  {
    "name": "Devamlılık ve Zaman Yönetimi",
    "category": "DAVRANISSAL",
    "description": "Devamsızlık yapmaz, iş süresini verimli kullanır.",
    "positive": [
      "Planlı izin kullanır",
      "İşleri önceliklendirir"
    ],
    "negative": [
      "Sık mazeretsiz devamsızlık",
      "İş erteleme"
    ]
  },
  {
    "name": "Teknik Yeterlilik",
    "category": "TEKNIK",
    "description": "Görevinin gerektirdiği teknik bilgi ve beceriye sahiptir.",
    "positive": [
      "Ekipmanı doğru parametrelerle çalıştırır",
      "Arıza belirtilerini erken tanır"
    ],
    "negative": [
      "Temel işlemleri sürekli sorar",
      "Yanlış parametre girer"
    ]
  },
  {
    "name": "Makine ve Ekipman Kullanımı",
    "category": "TEKNIK",
    "description": "Sorumlu olduğu makine ve ekipmanı güvenli ve doğru kullanır.",
    "positive": [
      "Vardiya başı kontrol yapar",
      "Ekipmanı amacı dışında kullanmaz"
    ],
    "negative": [
      "Kontrolsüz devreye alma",
      "Amaç dışı kullanım"
    ]
  },
  {
    "name": "Bakım Farkındalığı",
    "category": "TEKNIK",
    "description": "Ekipmanın bakım ihtiyacını fark eder ve bildirir.",
    "positive": [
      "Anormal ses/titreşimi raporlar",
      "Otonom bakım adımlarını uygular"
    ],
    "negative": [
      "Belirtileri görmezden gelir",
      "Bakım kartını doldurmaz"
    ]
  },
  {
    "name": "Problem Çözme",
    "category": "DAVRANISSAL",
    "description": "Sorunun kökenini anlar, uygun çözümü seçer veya doğru kişiye iletir.",
    "positive": [
      "Sorunu tanımlayıp raporlar",
      "Basit sorunları yetkisi dahilinde çözer"
    ],
    "negative": [
      "Sorunu devreder ve takip etmez",
      "Yetkisi dışına çıkar"
    ]
  },
  {
    "name": "Dikkat ve Konsantrasyon",
    "category": "DAVRANISSAL",
    "description": "Uzun süreli işlerde dikkatini korur, ayrıntıları fark eder.",
    "positive": [
      "Etiket/gösterge farklarını yakalar",
      "Rutinde hata yapmaz"
    ],
    "negative": [
      "Dalgınlık kaynaklı hata",
      "Göstergeleri atlama"
    ]
  },
  {
    "name": "Sorumluluk Alma",
    "category": "DAVRANISSAL",
    "description": "Görevini sahiplenir, sonuçlarının arkasında durur.",
    "positive": [
      "Hatasını bildirir",
      "Ek görevleri üstlenir"
    ],
    "negative": [
      "Hata gizleme",
      "Sorumluluğu başkasına atma"
    ]
  },
  {
    "name": "Takım Çalışması",
    "category": "DAVRANISSAL",
    "description": "Ekip içinde uyumlu çalışır, bilgi ve iş yükünü paylaşır.",
    "positive": [
      "Vardiya devrini eksiksiz yapar",
      "Arkadaşına destek olur"
    ],
    "negative": [
      "Bilgi saklama",
      "Ekipten kopuk çalışma"
    ]
  },
  {
    "name": "İletişim",
    "category": "DAVRANISSAL",
    "description": "Bilgiyi doğru, zamanında ve saygılı şekilde iletir.",
    "positive": [
      "Anlaşılır rapor verir",
      "Dinler ve teyit eder"
    ],
    "negative": [
      "Eksik/geç bilgi aktarımı",
      "Kaba üslup"
    ]
  },
  {
    "name": "Öğrenmeye Açıklık",
    "category": "SUREKLI_IYILESTIRME",
    "description": "Yeni bilgi ve becerileri öğrenmeye isteklidir.",
    "positive": [
      "Eğitimlere gönüllü katılır",
      "Öğrendiğini uygular"
    ],
    "negative": [
      "Eğitimden kaçınma",
      "Yeniliğe direnç"
    ]
  },
  {
    "name": "Değişime Uyum",
    "category": "SUREKLI_IYILESTIRME",
    "description": "Vardiya, görev ve süreç değişikliklerine hızla uyum sağlar.",
    "positive": [
      "Yeni düzene hızla adapte olur"
    ],
    "negative": [
      "Değişiklikte performans düşüşü",
      "Sürekli şikayet"
    ]
  },
  {
    "name": "Verimlilik Bilinci",
    "category": "SUREKLI_IYILESTIRME",
    "description": "Zaman, malzeme ve iş gücünü israf etmeden kullanır.",
    "positive": [
      "Fireyi azaltacak şekilde çalışır",
      "Duruş sürelerini bildirir"
    ],
    "negative": [
      "Malzeme israfı",
      "Gereksiz bekleme"
    ]
  },
  {
    "name": "Enerji ve Kaynak Kullanımı",
    "category": "SUREKLI_IYILESTIRME",
    "description": "Enerji ve doğal kaynakları bilinçli kullanır.",
    "positive": [
      "Kullanılmayan ekipmanı kapatır",
      "Kaçakları bildirir"
    ],
    "negative": [
      "Gereksiz enerji tüketimine kayıtsızlık"
    ]
  },
  {
    "name": "Çevre Bilinci",
    "category": "ISG",
    "description": "Atık yönetimi ve çevre kurallarına uyar.",
    "positive": [
      "Atıkları doğru ayrıştırır",
      "Döküntüyü prosedüre göre raporlar"
    ],
    "negative": [
      "Atığı yanlış alana bırakma"
    ]
  },
  {
    "name": "Düzen ve 5S Yaklaşımı",
    "category": "SUREKLI_IYILESTIRME",
    "description": "Çalışma alanını düzenli, temiz ve standartlara uygun tutar.",
    "positive": [
      "Aletleri yerine kaldırır",
      "Alan etiketlerine uyar"
    ],
    "negative": [
      "Dağınık saha",
      "Malzemeyi rastgele bırakma"
    ]
  },
  {
    "name": "Sürekli İyileştirme",
    "category": "SUREKLI_IYILESTIRME",
    "description": "İşini daha iyi yapmanın yollarını arar, öneri getirir.",
    "positive": [
      "İyileştirme önerisi sunar",
      "Kaizen çalışmalarına katılır"
    ],
    "negative": [
      "\"Hep böyle yapılırdı\" yaklaşımı"
    ]
  },
  {
    "name": "Ramak Kala Bildirim Kültürü",
    "category": "ISG",
    "description": "Ramak kala olayları çekinmeden ve zamanında bildirir.",
    "positive": [
      "Ramak kala formu doldurur",
      "Arkadaşlarını bildirime teşvik eder"
    ],
    "negative": [
      "Olayları saklama",
      "Bildirimi gereksiz görme"
    ]
  },
  {
    "name": "Riskleri Fark Etme",
    "category": "ISG",
    "description": "Sahadaki tehlike ve riskleri önceden fark eder.",
    "positive": [
      "Güvensiz koşulu iş başlamadan tespit eder"
    ],
    "negative": [
      "Belirgin riskleri gözden kaçırma"
    ]
  },
  {
    "name": "Kurumsal Değerlere Uyum",
    "category": "DAVRANISSAL",
    "description": "Şirket değerlerine ve etik kurallara uygun davranır.",
    "positive": [
      "Dürüst davranır",
      "Şirket itibarını gözetir"
    ],
    "negative": [
      "Etik dışı davranış",
      "Kurum kurallarını önemsememe"
    ]
  }
];

export const levelDefinitions: LevelDefinition[] = [
  {
    "level": 1,
    "text": "Temel farkındalık: gözetim altında beklenen davranışı gösterir."
  },
  {
    "level": 2,
    "text": "Gelişmekte: çoğu durumda beklenen davranışı gösterir, ara sıra hatırlatma gerekir."
  },
  {
    "level": 3,
    "text": "Yetkin: beklenen davranışı tutarlı ve bağımsız şekilde gösterir."
  },
  {
    "level": 4,
    "text": "İleri: zorlayıcı durumlarda da davranışı sürdürür, ekip arkadaşlarına örnek olur."
  },
  {
    "level": 5,
    "text": "Usta: bu alanda başkalarını yönlendirir, geliştirir ve süreç iyileştirme önerir."
  }
];
