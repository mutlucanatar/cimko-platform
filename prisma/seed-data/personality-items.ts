export type PersonalityItem = {
  section: number;
  dim: string;
  type: string;
  text: string;
  options?: { key: string; text: string }[];
  correctKey?: string;
  direction?: number;
};

export const PERSONALITY_ITEMS: PersonalityItem[] = [
  {
    "section": 1,
    "dim": "AGRESIFLIK",
    "type": "LIKERT3",
    "text": "Bir işi engellendiğinde sert tepki verdiğim olur.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "AGRESIFLIK",
    "type": "LIKERT3",
    "text": "Tartışmalarda sesimin yükseldiğini fark ederim.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "AGRESIFLIK",
    "type": "LIKERT3",
    "text": "Bir anlaşmazlıkta sakin kalmayı genellikle başarırım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "DUYGUSAL_DENGE",
    "type": "LIKERT3",
    "text": "Baskı altında da sakinliğimi korurum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "DUYGUSAL_DENGE",
    "type": "LIKERT3",
    "text": "Küçük aksaklıklar moralimi kolayca bozar.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "DUYGUSAL_DENGE",
    "type": "LIKERT3",
    "text": "Zor bir günün ardından kendimi hızla toparlarım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "GIRISKENLIK",
    "type": "LIKERT3",
    "text": "Bir sorun gördüğümde çözüm için ilk adımı atarım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "GIRISKENLIK",
    "type": "LIKERT3",
    "text": "Yeni bir görev verildiğinde beklemeden işe koyulurum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "GIRISKENLIK",
    "type": "LIKERT3",
    "text": "Birinin bana ne yapacağımı söylemesini beklerim.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "KISISEL_UYUM",
    "type": "LIKERT3",
    "text": "Farklı çalışma tarzlarına kolayca uyum sağlarım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "KISISEL_UYUM",
    "type": "LIKERT3",
    "text": "Ekipteki görev değişikliklerini sorun etmem.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "KISISEL_UYUM",
    "type": "LIKERT3",
    "text": "Alıştığım düzen bozulunca verimim çok düşer.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "KURALLARA_UYMA",
    "type": "LIKERT3",
    "text": "Talimatları, gereksiz görünse bile eksiksiz uygularım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "KURALLARA_UYMA",
    "type": "LIKERT3",
    "text": "İş güvenliği kurallarına uymak benim için pazarlık konusu değildir.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "KURALLARA_UYMA",
    "type": "LIKERT3",
    "text": "Acele işlerde bazı adımları atlamak kabul edilebilir.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "MUKEMMELIYETCILIK",
    "type": "LIKERT3",
    "text": "İşimi teslim etmeden önce mutlaka son bir kontrol yaparım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "MUKEMMELIYETCILIK",
    "type": "LIKERT3",
    "text": "Küçük hatalar beni rahatsız eder, düzeltmeden geçemem.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "MUKEMMELIYETCILIK",
    "type": "LIKERT3",
    "text": "\"Aşağı yukarı doğru\" benim için yeterlidir.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "OTO_KONTROL",
    "type": "LIKERT3",
    "text": "Karar vermeden önce sonuçlarını düşünürüm.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "OTO_KONTROL",
    "type": "LIKERT3",
    "text": "Aklıma geleni düşünmeden söylediğim olur.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "OTO_KONTROL",
    "type": "LIKERT3",
    "text": "Öfkelendiğimde davranışlarımı kontrol edebilirim.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "RISK_ALMA",
    "type": "LIKERT3",
    "text": "Sonucundan emin olmadığım işlere girmekten çekinmem.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "RISK_ALMA",
    "type": "LIKERT3",
    "text": "Tehlikeli olabilecek durumlarda bile hızlı davranmayı severim.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "RISK_ALMA",
    "type": "LIKERT3",
    "text": "Emin olmadığım durumda önce sorar, sonra yaparım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "SOSYALLIK",
    "type": "LIKERT3",
    "text": "Mola saatlerinde arkadaşlarımla vakit geçirmekten hoşlanırım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "SOSYALLIK",
    "type": "LIKERT3",
    "text": "Yeni tanıştığım kişilerle kolayca sohbet başlatırım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "SOSYALLIK",
    "type": "LIKERT3",
    "text": "Kalabalık ortamlarda uzun süre kalmak beni yorar.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "YENILIGE_ACIKLIK",
    "type": "LIKERT3",
    "text": "Yeni bir makine veya sistemi öğrenmek hoşuma gider.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "YENILIGE_ACIKLIK",
    "type": "LIKERT3",
    "text": "İşimi daha iyi yapmanın yollarını araştırırım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "YENILIGE_ACIKLIK",
    "type": "LIKERT3",
    "text": "Alışılmış yöntem dururken yenisini denemek gereksizdir.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Biraz Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "AGRESIFLIK",
    "type": "SIFAT",
    "text": "Sert mizaçlı",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "DUYGUSAL_DENGE",
    "type": "SIFAT",
    "text": "Soğukkanlı",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "DUYGUSAL_DENGE",
    "type": "SIFAT",
    "text": "Çabuk telaşlanan",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "GIRISKENLIK",
    "type": "SIFAT",
    "text": "Girişken",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "KISISEL_UYUM",
    "type": "SIFAT",
    "text": "Uyumlu",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "KURALLARA_UYMA",
    "type": "SIFAT",
    "text": "Kurallara bağlı",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "MUKEMMELIYETCILIK",
    "type": "SIFAT",
    "text": "Titiz",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "MUKEMMELIYETCILIK",
    "type": "SIFAT",
    "text": "Dağınık",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": -1
  },
  {
    "section": 1,
    "dim": "OTO_KONTROL",
    "type": "SIFAT",
    "text": "Ölçülü",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "RISK_ALMA",
    "type": "SIFAT",
    "text": "Gözü kara",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "SOSYALLIK",
    "type": "SIFAT",
    "text": "Sosyal",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 1,
    "dim": "YENILIGE_ACIKLIK",
    "type": "SIFAT",
    "text": "Meraklı",
    "options": [
      {
        "key": "0",
        "text": "Bana uymuyor"
      },
      {
        "key": "1",
        "text": "Bana uyuyor"
      }
    ],
    "direction": 1
  },
  {
    "section": 2,
    "dim": "AGRESIFLIK",
    "type": "IKILI_SECIM",
    "text": "İşler yolunda gitmediğinde...",
    "options": [
      {
        "key": "a",
        "text": "çevremdekilere sert davrandığım olur"
      },
      {
        "key": "b",
        "text": "sakin kalıp çözüm ararım"
      }
    ],
    "correctKey": "a",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "DUYGUSAL_DENGE",
    "type": "IKILI_SECIM",
    "text": "Beklenmedik bir arıza anında...",
    "options": [
      {
        "key": "a",
        "text": "önce derin bir nefes alır, adım adım ilerlerim"
      },
      {
        "key": "b",
        "text": "panikleyip ne yapacağımı şaşırdığım olur"
      }
    ],
    "correctKey": "a",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "GIRISKENLIK",
    "type": "IKILI_SECIM",
    "text": "Yeni bir görev fırsatı çıktığında...",
    "options": [
      {
        "key": "a",
        "text": "gönüllü olurum"
      },
      {
        "key": "b",
        "text": "başkasının almasını beklerim"
      }
    ],
    "correctKey": "a",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "KISISEL_UYUM",
    "type": "IKILI_SECIM",
    "text": "Vardiyam değiştirildiğinde...",
    "options": [
      {
        "key": "a",
        "text": "düzenime uymadığı için zorlanırım"
      },
      {
        "key": "b",
        "text": "kısa sürede yeni düzene alışırım"
      }
    ],
    "correctKey": "b",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "KURALLARA_UYMA",
    "type": "IKILI_SECIM",
    "text": "Bir talimat bana mantıksız göründüğünde...",
    "options": [
      {
        "key": "a",
        "text": "yine de uygular, sonra amirime iletirim"
      },
      {
        "key": "b",
        "text": "kendi bildiğim şekilde yaparım"
      }
    ],
    "correctKey": "a",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "MUKEMMELIYETCILIK",
    "type": "IKILI_SECIM",
    "text": "Bir işi bitirirken benim için önemli olan...",
    "options": [
      {
        "key": "a",
        "text": "hızlı bitirmektir"
      },
      {
        "key": "b",
        "text": "eksiksiz ve hatasız bitirmektir"
      }
    ],
    "correctKey": "b",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "OTO_KONTROL",
    "type": "IKILI_SECIM",
    "text": "Bir arkadaşım bana haksız çıkıştığında...",
    "options": [
      {
        "key": "a",
        "text": "anında karşılık veririm"
      },
      {
        "key": "b",
        "text": "sakinleşince konuyu konuşurum"
      }
    ],
    "correctKey": "b",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "RISK_ALMA",
    "type": "IKILI_SECIM",
    "text": "Emniyet kilidi arızalı bir makine ile karşılaşırsam...",
    "options": [
      {
        "key": "a",
        "text": "işi durdurur, bakım ekibine haber veririm"
      },
      {
        "key": "b",
        "text": "dikkatli olup işe devam ederim"
      }
    ],
    "correctKey": "b",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "SOSYALLIK",
    "type": "IKILI_SECIM",
    "text": "Bir topluluk içindeyken genellikle...",
    "options": [
      {
        "key": "a",
        "text": "kenarda durur, izlerim"
      },
      {
        "key": "b",
        "text": "sohbete katılırım"
      }
    ],
    "correctKey": "b",
    "direction": 1
  },
  {
    "section": 2,
    "dim": "YENILIGE_ACIKLIK",
    "type": "IKILI_SECIM",
    "text": "Yeni bir sistem devreye alındığında...",
    "options": [
      {
        "key": "a",
        "text": "öğrenmek için istekli olurum"
      },
      {
        "key": "b",
        "text": "eski sistemin kalmasını tercih ederim"
      }
    ],
    "correctKey": "a",
    "direction": 1
  }
];


export type WellbeingItem = {
  text: string;
  options?: { key: string; text: string }[];
  correctKey?: string;
  direction?: number;
};

export const WELLBEING_ITEMS: WellbeingItem[] = [
  {
    "text": "Son zamanlarda kendimi işe karşı isteksiz hissediyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Gün içinde enerjimin çabuk tükendiğini fark ediyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "İş yerindeki sorumluluklarım bana ağır geliyor.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Son günlerde uykumun düzensiz olduğunu düşünüyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Küçük şeylere eskisinden daha çabuk sinirleniyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Dikkatimi toplamakta zorlandığım oluyor.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Son zamanlarda kendimi gergin hissediyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "İş dışındaki uğraşlardan eskisi kadar keyif alamıyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Yakın çevremle vakit geçirme isteğim azaldı.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Son on günde beni zorlayan bir olay yaşadım.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Kendime ayıracak zaman bulmakta zorlanıyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  },
  {
    "text": "Yaptığım işlerde eskisinden daha fazla hata yapıyorum.",
    "options": [
      {
        "key": "0",
        "text": "Katılmıyorum"
      },
      {
        "key": "1",
        "text": "Kısmen Katılıyorum"
      },
      {
        "key": "2",
        "text": "Katılıyorum"
      }
    ],
    "direction": 1
  }
];


export const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  "AGRESIFLIK": "Engellenme ve anlaşmazlık durumlarında sert, tepkisel davranma eğilimini ifade eder. Düşük puan sakin ve yapıcı tepkileri, yüksek puan ani ve sert çıkışları işaret eder. Saha ortamında düşük-orta düzey tercih edilir.",
  "DUYGUSAL_DENGE": "Baskı, aksaklık ve değişim karşısında duygusal dengeyi koruyabilmeyi ifade eder. Yüksek puan stres altında sakin kalabilmeyi, düşük puan kolay etkilenmeyi gösterir.",
  "GIRISKENLIK": "İşe kendiliğinden başlama, sorumluluk üstlenme ve harekete geçme eğilimidir. Yüksek puan inisiyatif almayı, düşük puan yönlendirilmeyi bekleme eğilimini gösterir.",
  "KISISEL_UYUM": "Değişen görev, ekip ve çalışma koşullarına ayak uydurabilmeyi ifade eder. Yüksek puan esnekliği, düşük puan alışılmış düzene bağlılığı gösterir.",
  "KURALLARA_UYMA": "Talimat, prosedür ve iş güvenliği kurallarına bağlılığı ifade eder. Üretim ve İSG açısından kritik boyutlardan biridir; yüksek puan tercih edilir.",
  "MUKEMMELIYETCILIK": "İşin eksiksiz, düzenli ve hatasız yapılmasına verilen önemi ifade eder. Yüksek puan titizliği, aşırı yüksek puan ise esneklik kaybını işaret edebilir.",
  "OTO_KONTROL": "Davranış ve tepkileri düşünerek yönetebilme becerisidir. Yüksek puan ölçülü ve planlı davranmayı, düşük puan dürtüsel hareket etmeyi gösterir.",
  "RISK_ALMA": "Belirsiz veya tehlikeli durumlarda kural dışına çıkma ve hızlı davranma eğilimidir. Endüstriyel sahada düşük puan tercih edilir; yüksek puan İSG riski işaretidir.",
  "SOSYALLIK": "İnsanlarla birlikte olmaktan hoşlanma ve iletişim kurma eğilimidir. Ekip çalışması gerektiren rollerde orta-yüksek düzey desteklenir.",
  "YENILIGE_ACIKLIK": "Yeni yöntem, makine ve sistemleri öğrenmeye isteklilik düzeyidir. Yüksek puan öğrenme çevikliğini, düşük puan alışkanlıklara bağlılığı gösterir."
};
