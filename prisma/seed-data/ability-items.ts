export type AbilityItem = {
  text: string;
  dimension: string;
  options: { key: string; text: string }[];
  correctKey: string;
  difficulty?: string;
};

export const ABILITY_ITEMS: AbilityItem[] = [
  {
    "text": "Bir paketleme hattı dakikada 12 torba çimento dolduruyor. Hat 45 dakika kesintisiz çalışırsa toplam kaç torba doldurur?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "480"
      },
      {
        "key": "b",
        "text": "520"
      },
      {
        "key": "c",
        "text": "540"
      },
      {
        "key": "d",
        "text": "560"
      },
      {
        "key": "e",
        "text": "600"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir silodaki 800 ton çimentonun %15'i sevk edildi. Siloda kaç ton çimento kalmıştır?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "640"
      },
      {
        "key": "b",
        "text": "660"
      },
      {
        "key": "c",
        "text": "680"
      },
      {
        "key": "d",
        "text": "700"
      },
      {
        "key": "e",
        "text": "720"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu sayı dizisinde kural nedir ve sıradaki sayı hangisidir? 8, 11, 16, 23, 32, ...",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "41"
      },
      {
        "key": "b",
        "text": "43"
      },
      {
        "key": "c",
        "text": "45"
      },
      {
        "key": "d",
        "text": "47"
      },
      {
        "key": "e",
        "text": "49"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir vardiyada 3 operatör toplam 270 palet hazırlıyor. Aynı hızla çalışan 5 operatör bir vardiyada toplam kaç palet hazırlar?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "360"
      },
      {
        "key": "b",
        "text": "400"
      },
      {
        "key": "c",
        "text": "420"
      },
      {
        "key": "d",
        "text": "450"
      },
      {
        "key": "e",
        "text": "500"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir mikserin tamburuna 2,5 m³ beton için 875 kg agrega gerekiyor. 8 m³ beton için kaç kg agrega gerekir?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "2.600"
      },
      {
        "key": "b",
        "text": "2.700"
      },
      {
        "key": "c",
        "text": "2.800"
      },
      {
        "key": "d",
        "text": "2.900"
      },
      {
        "key": "e",
        "text": "3.000"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Günlük üretim hedefi 1.200 torbadır. İlk 6 saatte hedefin %40'ı üretildiyse kaç torba üretilmiştir?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "400"
      },
      {
        "key": "b",
        "text": "440"
      },
      {
        "key": "c",
        "text": "460"
      },
      {
        "key": "d",
        "text": "480"
      },
      {
        "key": "e",
        "text": "520"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir bakım ekibi 4 makinenin periyodik bakımını 6 saatte bitiriyor. Aynı tempoyla 10 makinenin bakımı kaç saat sürer?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "12"
      },
      {
        "key": "b",
        "text": "13"
      },
      {
        "key": "c",
        "text": "14"
      },
      {
        "key": "d",
        "text": "15"
      },
      {
        "key": "e",
        "text": "16"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "Kalite kontrolde incelenen 250 numunenin 10 tanesi standart dışı çıkmıştır. Standart dışı numune oranı yüzde kaçtır?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "%2"
      },
      {
        "key": "b",
        "text": "%3"
      },
      {
        "key": "c",
        "text": "%4"
      },
      {
        "key": "d",
        "text": "%5"
      },
      {
        "key": "e",
        "text": "%6"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir kamyona her biri 25 kg olan torbalardan en fazla 1.100 kg yüklenebilir. Kamyona en çok kaç torba yüklenebilir?",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "40"
      },
      {
        "key": "b",
        "text": "42"
      },
      {
        "key": "c",
        "text": "44"
      },
      {
        "key": "d",
        "text": "45"
      },
      {
        "key": "e",
        "text": "46"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu dizide sıradaki sayı hangisidir? 3, 6, 12, 24, 48, ...",
    "dimension": "SAYISAL",
    "options": [
      {
        "key": "a",
        "text": "72"
      },
      {
        "key": "b",
        "text": "84"
      },
      {
        "key": "c",
        "text": "90"
      },
      {
        "key": "d",
        "text": "96"
      },
      {
        "key": "e",
        "text": "102"
      }
    ],
    "correctKey": "d",
    "difficulty": "KOLAY"
  },
  {
    "text": "\"Termometre – Sıcaklık\" arasındaki ilişki aşağıdakilerin hangisinde vardır?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Kantar – Ağırlık"
      },
      {
        "key": "b",
        "text": "Çekiç – Çivi"
      },
      {
        "key": "c",
        "text": "Motor – Yakıt"
      },
      {
        "key": "d",
        "text": "Kablo – Elektrik"
      },
      {
        "key": "e",
        "text": "Vinç – Yük"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Aşağıdaki kelimelerden hangisi diğerlerinden farklı bir gruba girer?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Matkap"
      },
      {
        "key": "b",
        "text": "Tornavida"
      },
      {
        "key": "c",
        "text": "Pense"
      },
      {
        "key": "d",
        "text": "El aleti"
      },
      {
        "key": "e",
        "text": "Anahtar"
      }
    ],
    "correctKey": "d",
    "difficulty": "KOLAY"
  },
  {
    "text": "\"güvenlik / önce / her işten / gelir\" kelimeleriyle kurulacak anlamlı cümlenin ilk kelimesi hangisidir?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "güvenlik"
      },
      {
        "key": "b",
        "text": "önce"
      },
      {
        "key": "c",
        "text": "her işten"
      },
      {
        "key": "d",
        "text": "gelir"
      },
      {
        "key": "e",
        "text": "cümle kurulamaz"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "\"Talimat\" kelimesinin anlamca en yakın karşılığı aşağıdakilerden hangisidir?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Öneri"
      },
      {
        "key": "b",
        "text": "Yönerge"
      },
      {
        "key": "c",
        "text": "Rapor"
      },
      {
        "key": "d",
        "text": "Tutanak"
      },
      {
        "key": "e",
        "text": "Duyuru"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Kişisel koruyucu donanım (KKD), çalışanı iş kazası ve meslek hastalığı risklerinden koruyan malzemelerin tümüne verilen addır. Baret, iş gözlüğü, toz maskesi ve çelik burunlu ayakkabı bunlara örnektir. KKD'nin koruyuculuğu ancak doğru seçilir, düzenli kullanılır ve bakımı yapılırsa sağlanır.\n\nBu parçaya göre aşağıdakilerden hangisi söylenemez?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Baret bir kişisel koruyucu donanımdır"
      },
      {
        "key": "b",
        "text": "KKD'nin işe uygun seçilmesi gerekir"
      },
      {
        "key": "c",
        "text": "KKD düzenli kullanılmalıdır"
      },
      {
        "key": "d",
        "text": "KKD tek başına tüm kazaları tamamen önler"
      },
      {
        "key": "e",
        "text": "KKD'nin bakımı koruyuculuğu etkiler"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "\"Devriye\" – \"Kontrol turu\" ilişkisine en yakın ikili hangisidir?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Rapor – Toplantı"
      },
      {
        "key": "b",
        "text": "Sayım – Envanter kontrolü"
      },
      {
        "key": "c",
        "text": "Vardiya – Mesai"
      },
      {
        "key": "d",
        "text": "Arıza – Bakım"
      },
      {
        "key": "e",
        "text": "Numune – Laboratuvar"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Aşağıdaki kelimelerin hangisi \"DEĞİRMEN\" kelimesinin harfleri kullanılarak yazılamaz?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "DEMİR"
      },
      {
        "key": "b",
        "text": "DEREN"
      },
      {
        "key": "c",
        "text": "MİDE"
      },
      {
        "key": "d",
        "text": "DENGE"
      },
      {
        "key": "e",
        "text": "DİREN"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "\"Üretim raporunu vardiya bitmeden ______ gerekir.\" cümlesini en uygun tamamlayan kelime hangisidir?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "tamamlamak"
      },
      {
        "key": "b",
        "text": "başlamak"
      },
      {
        "key": "c",
        "text": "ertelemek"
      },
      {
        "key": "d",
        "text": "unutmak"
      },
      {
        "key": "e",
        "text": "devretmek"
      }
    ],
    "correctKey": "a",
    "difficulty": "KOLAY"
  },
  {
    "text": "Fabrikada atık yağlar, kimyasal bidonları ve kullanılmış filtreler \"tehlikeli atık\" sayılır ve ayrı toplanır. Tehlikeli atıklar kesinlikle evsel atık konteynerine atılmaz; sahadaki kırmızı etiketli alanlarda biriktirilir ve lisanslı firmalara teslim edilir.\n\nBu parçaya göre kullanılmış bir filtre nereye bırakılmalıdır?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Evsel atık konteynerine"
      },
      {
        "key": "b",
        "text": "Kırmızı etiketli tehlikeli atık alanına"
      },
      {
        "key": "c",
        "text": "Depo rafına"
      },
      {
        "key": "d",
        "text": "Açık sahaya"
      },
      {
        "key": "e",
        "text": "Herhangi bir çöp kutusuna"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Aşağıdakilerden hangisi diğerlerinin tümünü kapsayan üst kavramdır?",
    "dimension": "SOZEL",
    "options": [
      {
        "key": "a",
        "text": "Klinker"
      },
      {
        "key": "b",
        "text": "Çimento"
      },
      {
        "key": "c",
        "text": "Agrega"
      },
      {
        "key": "d",
        "text": "Yapı malzemesi"
      },
      {
        "key": "e",
        "text": "Beton"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu dizide sıradaki öğe hangisidir? ● ■ ■ ● ■ ■ ● ■ ■ ...",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "●"
      },
      {
        "key": "b",
        "text": "■"
      },
      {
        "key": "c",
        "text": "▲"
      },
      {
        "key": "d",
        "text": "●●"
      },
      {
        "key": "e",
        "text": "■■"
      }
    ],
    "correctKey": "a",
    "difficulty": "KOLAY"
  },
  {
    "text": "A=1, B=2, C=3 ... olduğuna göre \"CE\" harf çiftinin sayı karşılığı hangisidir?",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "3-5"
      },
      {
        "key": "b",
        "text": "3-4"
      },
      {
        "key": "c",
        "text": "2-5"
      },
      {
        "key": "d",
        "text": "4-5"
      },
      {
        "key": "e",
        "text": "3-6"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu harf dizisinde sıradaki harf hangisidir? B, D, G, K, P, ...",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "R"
      },
      {
        "key": "b",
        "text": "S"
      },
      {
        "key": "c",
        "text": "T"
      },
      {
        "key": "d",
        "text": "U"
      },
      {
        "key": "e",
        "text": "V"
      }
    ],
    "correctKey": "d",
    "difficulty": "ZOR"
  },
  {
    "text": "▲ = 2, ■ = 3, ● = 5 ise ▲ + ■ × ● işleminin sonucu kaçtır?",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "17"
      },
      {
        "key": "b",
        "text": "25"
      },
      {
        "key": "c",
        "text": "21"
      },
      {
        "key": "d",
        "text": "15"
      },
      {
        "key": "e",
        "text": "19"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "\"KAPI\" kelimesi 1-2-3-4 olarak kodlanıyorsa \"PAKI\" kelimesinin kodu nedir?",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "3-2-1-4"
      },
      {
        "key": "b",
        "text": "3-1-2-4"
      },
      {
        "key": "c",
        "text": "4-2-1-3"
      },
      {
        "key": "d",
        "text": "3-2-4-1"
      },
      {
        "key": "e",
        "text": "2-3-1-4"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu dizide kurala uymayan öğe hangisidir? 5, 10, 20, 40, 70, 160",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "10"
      },
      {
        "key": "b",
        "text": "20"
      },
      {
        "key": "c",
        "text": "40"
      },
      {
        "key": "d",
        "text": "70"
      },
      {
        "key": "e",
        "text": "160"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "● ▲ için ne ise, ■ ◆ için odur. Buna göre ● ile ■ arasındaki ortak ilişki hangisidir? (● daire, ▲ üçgen; ■ kare, ◆ eşkenar dörtgen)",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "Her ikisi de köşesiz şekildir"
      },
      {
        "key": "b",
        "text": "Birinci şekil, ikinci şeklin döndürülmüş hâlidir"
      },
      {
        "key": "c",
        "text": "İlk şekiller köşesiz/temel, ikinciler köşeli/türetilmiş biçimlerdir"
      },
      {
        "key": "d",
        "text": "Şekiller arasında ilişki yoktur"
      },
      {
        "key": "e",
        "text": "Hepsi aynı büyüklüktedir"
      }
    ],
    "correctKey": "c",
    "difficulty": "ZOR"
  },
  {
    "text": "Bir kural şöyledir: Sayı çiftse 2'ye böl, tekse 3 ekle. 14 sayısına kural iki kez uygulanırsa sonuç kaç olur?",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "7"
      },
      {
        "key": "b",
        "text": "10"
      },
      {
        "key": "c",
        "text": "12"
      },
      {
        "key": "d",
        "text": "5"
      },
      {
        "key": "e",
        "text": "9"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu dizide sıradaki öğe hangisidir? 1A, 3C, 5E, 7G, ...",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "8H"
      },
      {
        "key": "b",
        "text": "9I"
      },
      {
        "key": "c",
        "text": "9İ"
      },
      {
        "key": "d",
        "text": "10J"
      },
      {
        "key": "e",
        "text": "8I"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Dört vardiya sırayla çalışıyor: A, B, C, D, A, B, C, D... Bugün C vardiyası çalıştıysa 6 gün sonra hangi vardiya çalışır?",
    "dimension": "SOYUT",
    "options": [
      {
        "key": "a",
        "text": "A"
      },
      {
        "key": "b",
        "text": "B"
      },
      {
        "key": "c",
        "text": "C"
      },
      {
        "key": "d",
        "text": "D"
      },
      {
        "key": "e",
        "text": "Belirlenemez"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Aşağıdaki irsaliye numaralarından hangisi diğerlerinden farklıdır?",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "İRS-2026-48173"
      },
      {
        "key": "b",
        "text": "İRS-2026-48173"
      },
      {
        "key": "c",
        "text": "İRS-2026-48137"
      },
      {
        "key": "d",
        "text": "İRS-2026-48173"
      },
      {
        "key": "e",
        "text": "İRS-2026-48173"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "\"CMK-580-TRB\" koduyla birebir aynı olan seçenek hangisidir?",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "CMK-508-TRB"
      },
      {
        "key": "b",
        "text": "CMK-580-TRB"
      },
      {
        "key": "c",
        "text": "CMK-580-TBR"
      },
      {
        "key": "d",
        "text": "CMX-580-TRB"
      },
      {
        "key": "e",
        "text": "CMK-58O-TRB"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu dizide \"7\" rakamı kaç kez geçmektedir? 4 7 1 7 9 7 3 5 7 2 7 8 6 7",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "4"
      },
      {
        "key": "b",
        "text": "5"
      },
      {
        "key": "c",
        "text": "6"
      },
      {
        "key": "d",
        "text": "7"
      },
      {
        "key": "e",
        "text": "8"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Aşağıdaki torba etiketlerinden hangisi \"CEM I 42,5 R\" ile birebir aynıdır?",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "CEM I 42.5 R"
      },
      {
        "key": "b",
        "text": "CEM II 42,5 R"
      },
      {
        "key": "c",
        "text": "CEM I 42,5 R"
      },
      {
        "key": "d",
        "text": "CEM I 42,5 N"
      },
      {
        "key": "e",
        "text": "CEM 1 42,5 R"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu harf dizisinde en çok tekrar eden harf hangisidir? K M K T K M T T K M K",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "K"
      },
      {
        "key": "b",
        "text": "M"
      },
      {
        "key": "c",
        "text": "T"
      },
      {
        "key": "d",
        "text": "K ve T eşit"
      },
      {
        "key": "e",
        "text": "M ve T eşit"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "İki liste karşılaştırılıyor. Kaç satırda fark vardır?\nListe 1: 4821 / 5730 / 6194 / 8452\nListe 2: 4821 / 5703 / 6194 / 8425",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "0"
      },
      {
        "key": "b",
        "text": "1"
      },
      {
        "key": "c",
        "text": "2"
      },
      {
        "key": "d",
        "text": "3"
      },
      {
        "key": "e",
        "text": "4"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "\"PALET-A6\" ifadesinin ters yazılışı hangisidir?",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "6A-TELAP"
      },
      {
        "key": "b",
        "text": "A6-TELAP"
      },
      {
        "key": "c",
        "text": "6A-TELAP-"
      },
      {
        "key": "d",
        "text": "6A-TALEP"
      },
      {
        "key": "e",
        "text": "6A-PELAT"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Şu dizide art arda iki kez yazılmış öğe hangisidir? 12 45 78 78 32 90 45",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "12"
      },
      {
        "key": "b",
        "text": "45"
      },
      {
        "key": "c",
        "text": "78"
      },
      {
        "key": "d",
        "text": "32"
      },
      {
        "key": "e",
        "text": "90"
      }
    ],
    "correctKey": "c",
    "difficulty": "KOLAY"
  },
  {
    "text": "Aşağıdaki sicil numaralarından hangisi \"MS-0417-K\" ile aynı DEĞİLDİR?",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "MS-0417-K"
      },
      {
        "key": "b",
        "text": "MS-0417-K"
      },
      {
        "key": "c",
        "text": "MS-0417-K"
      },
      {
        "key": "d",
        "text": "MS-0471-K"
      },
      {
        "key": "e",
        "text": "MS-0417-K"
      }
    ],
    "correctKey": "d",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir vardiya çizelgesinde şu saatler yazılıdır: 08:00, 16:00, 24:00, 08:00, 16:00, 00:00. Çizelgede hatalı (standart dışı) yazılmış saat hangisidir?",
    "dimension": "DIKKAT",
    "options": [
      {
        "key": "a",
        "text": "08:00"
      },
      {
        "key": "b",
        "text": "16:00"
      },
      {
        "key": "c",
        "text": "24:00"
      },
      {
        "key": "d",
        "text": "00:00"
      },
      {
        "key": "e",
        "text": "Hepsi doğru"
      }
    ],
    "correctKey": "c",
    "difficulty": "ORTA"
  },
  {
    "text": "Birbirine geçmiş iki dişliden büyük olan saat yönünde dönerse, küçük dişli hangi yönde döner?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Saat yönünde"
      },
      {
        "key": "b",
        "text": "Saat yönünün tersine"
      },
      {
        "key": "c",
        "text": "Dönmez"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Aynı kayışla bağlı iki kasnaktan küçük olan, büyük olana göre nasıl döner?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Daha hızlı"
      },
      {
        "key": "b",
        "text": "Daha yavaş"
      },
      {
        "key": "c",
        "text": "Aynı hızda"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Uzun saplı bir anahtar ile kısa saplı bir anahtar aynı cıvatayı söküyor. Hangisiyle daha az kuvvet gerekir?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Kısa saplı anahtar"
      },
      {
        "key": "b",
        "text": "Uzun saplı anahtar"
      },
      {
        "key": "c",
        "text": "İkisi de aynı"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir forklift yükü ne kadar yukarı kaldırırsa devrilme riski nasıl değişir?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Artar"
      },
      {
        "key": "b",
        "text": "Azalır"
      },
      {
        "key": "c",
        "text": "Değişmez"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir yükü tek sabit makarayla kaldırmak, yükü doğrudan kaldırmaya göre uygulanacak kuvveti nasıl etkiler?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Kuvvet miktarını azaltır"
      },
      {
        "key": "b",
        "text": "Kuvvet miktarı aynı kalır, yön değiştirir"
      },
      {
        "key": "c",
        "text": "Kuvveti iki katına çıkarır"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  },
  {
    "text": "Eğimli bir rampadan yukarı itilen yük arabası için hangisi doğrudur?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Rampa dikleştikçe daha çok kuvvet gerekir"
      },
      {
        "key": "b",
        "text": "Rampa eğimi kuvveti etkilemez"
      },
      {
        "key": "c",
        "text": "Rampa dikleştikçe daha az kuvvet gerekir"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Bir boruda akan suyun basıncı, boru daraldığında akış hızı için ne söylenebilir?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Akış hızı artar"
      },
      {
        "key": "b",
        "text": "Akış hızı azalır"
      },
      {
        "key": "c",
        "text": "Akış hızı değişmez"
      }
    ],
    "correctKey": "a",
    "difficulty": "ORTA"
  },
  {
    "text": "Titreşimli çalışan bir makinede zamanla gevşeyen cıvatalar için en doğru önlem hangisidir?",
    "dimension": "MEKANIK",
    "options": [
      {
        "key": "a",
        "text": "Cıvatayı daha az sıkmak"
      },
      {
        "key": "b",
        "text": "Kilitli somun/rondela kullanmak ve periyodik tork kontrolü yapmak"
      },
      {
        "key": "c",
        "text": "Cıvatayı yağlamak"
      }
    ],
    "correctKey": "b",
    "difficulty": "ORTA"
  }
];
