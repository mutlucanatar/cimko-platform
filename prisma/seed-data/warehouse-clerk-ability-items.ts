export type WarehouseClerkAbilityItem = {
  text: string;
  dimension:
    | "SAYISAL"
    | "SOZEL"
    | "SOYUT"
    | "DIKKAT";
  difficulty:
    | "KOLAY"
    | "ORTA"
    | "ZOR";
  options: {
    key: string;
    text: string;
  }[];
  correctKey: string;
};

export const WAREHOUSE_CLERK_ABILITY_ITEMS: WarehouseClerkAbilityItem[] = [
  {
    text: "Bir ambar rafında 6 kutunun her birinde 12 malzeme vardır. Toplam kaç malzeme vardır?",
    dimension: "SAYISAL",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "62" },
      { key: "B", text: "72" },
      { key: "C", text: "82" },
      { key: "D", text: "92" },
    ],
    correctKey: "B",
  },
  {
    text: "Bir sayım işlemi 08:30'da başlayıp 11:00'de tamamlanıyor. İşlem kaç saat sürmüştür?",
    dimension: "SAYISAL",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "2,5" },
      { key: "C", text: "3" },
      { key: "D", text: "3,5" },
    ],
    correctKey: "B",
  },
  {
    text: "200 malzemenin 40 tanesi sevk edilmiştir. Sevk edilenlerin toplam içindeki oranı yüzde kaçtır?",
    dimension: "SAYISAL",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "%10" },
      { key: "B", text: "%20" },
      { key: "C", text: "%25" },
      { key: "D", text: "%30" },
    ],
    correctKey: "B",
  },
  {
    text: "Üç sayımda sırasıyla 30, 40 ve 50 malzeme sayılmıştır. Ortalama kaç malzeme sayılmıştır?",
    dimension: "SAYISAL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "35" },
      { key: "B", text: "40" },
      { key: "C", text: "45" },
      { key: "D", text: "50" },
    ],
    correctKey: "B",
  },
  {
    text: "Bir malzemenin miktarı 80 adetten 100 adede çıkmıştır. Artış oranı yüzde kaçtır?",
    dimension: "SAYISAL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "%20" },
      { key: "B", text: "%25" },
      { key: "C", text: "%30" },
      { key: "D", text: "%40" },
    ],
    correctKey: "B",
  },
  {
    text: "4 çalışan toplam 80 koli sayıyor. Eşit paylaşılırsa kişi başına kaç koli düşer?",
    dimension: "SAYISAL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "15" },
      { key: "B", text: "20" },
      { key: "C", text: "25" },
      { key: "D", text: "30" },
    ],
    correctKey: "B",
  },
  {
    text: "Bir ambarda 350 malzeme vardır. 125 malzeme çıkışı yapılmıştır. Kaç malzeme kalmıştır?",
    dimension: "SAYISAL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "215" },
      { key: "B", text: "225" },
      { key: "C", text: "235" },
      { key: "D", text: "245" },
    ],
    correctKey: "B",
  },
  {
    text: "Bir sayım işlemi 15 dakika sürüyor. Aynı işlem 8 kez yapılırsa toplam süre kaç saattir?",
    dimension: "SAYISAL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "1 saat" },
      { key: "B", text: "2 saat" },
      { key: "C", text: "2 saat 15 dakika" },
      { key: "D", text: "2 saat 30 dakika" },
    ],
    correctKey: "B",
  },
  {
    text: "Bir stok miktarı 250'den 200'e düşmüştür. Azalma oranı yüzde kaçtır?",
    dimension: "SAYISAL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "%15" },
      { key: "B", text: "%20" },
      { key: "C", text: "%25" },
      { key: "D", text: "%30" },
    ],
    correctKey: "B",
  },
  {
    text: "Bir ambar sayımının ilk gün %30'u tamamlanıyor. İkinci gün kalan işin %50'si tamamlanıyor. İki gün sonunda toplam sayımın yüzde kaçı tamamlanmıştır?",
    dimension: "SAYISAL",
    difficulty: "ZOR",
    options: [
      { key: "A", text: "%55" },
      { key: "B", text: "%60" },
      { key: "C", text: "%65" },
      { key: "D", text: "%70" },
    ],
    correctKey: "B",
  },
  {
    text: "\"Stok\" kelimesine en yakın anlam hangisidir?",
    dimension: "SOZEL",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "Mevcut malzeme miktarı" },
      { key: "B", text: "Çalışma süresi" },
      { key: "C", text: "Taşıma yolu" },
      { key: "D", text: "Çalışma alanı" },
    ],
    correctKey: "A",
  },
  {
    text: "Malzeme teslim alınırken önce kayıtların ______.",
    dimension: "SOZEL",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "kontrol edilmesi gerekir" },
      { key: "B", text: "silinmesi gerekir" },
      { key: "C", text: "ertelenmesi gerekir" },
      { key: "D", text: "değiştirilmesi gerekir" },
    ],
    correctKey: "A",
  },
  {
    text: "Hangisi diğerlerinden farklıdır?",
    dimension: "SOZEL",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "Kutu" },
      { key: "B", text: "Palet" },
      { key: "C", text: "Raf" },
      { key: "D", text: "Baret" },
    ],
    correctKey: "D",
  },
  {
    text: "\"Sayım – Stok\" ilişkisine en yakın ilişki hangisidir?",
    dimension: "SOZEL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "Kontrol – Malzeme" },
      { key: "B", text: "Hız – Bekleme" },
      { key: "C", text: "Giriş – Çıkış" },
      { key: "D", text: "Başlangıç – Bitiş" },
    ],
    correctKey: "A",
  },
  {
    text: "Bir malzemenin etiketi okunamıyorsa çalışan kayıt yapmadan önce ne yapmalıdır?",
    dimension: "SOZEL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "Tahminde bulunmalıdır" },
      { key: "B", text: "Bilgiyi netleştirmelidir" },
      { key: "C", text: "Malzemeyi kayıtsız bırakmalıdır" },
      { key: "D", text: "Etiketi değiştirmelidir" },
    ],
    correctKey: "B",
  },
  {
    text: "\"Uygunsuzluk\" sözcüğüne en yakın ifade hangisidir?",
    dimension: "SOZEL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "Beklenenden farklılık" },
      { key: "B", text: "Düzenli çalışma" },
      { key: "C", text: "İş bölümü" },
      { key: "D", text: "Dinlenme" },
    ],
    correctKey: "A",
  },
  {
    text: "\"önce / malzemeyi / teslim / kayıtları / kontrol et\" kelimeleriyle anlamlı cümlenin ilk kelimesi hangisidir?",
    dimension: "SOZEL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "Önce" },
      { key: "B", text: "Malzemeyi" },
      { key: "C", text: "Teslim" },
      { key: "D", text: "Kayıtları" },
    ],
    correctKey: "A",
  },
  {
    text: "Ambar kayıtlarının düzenli tutulması neden önemlidir?",
    dimension: "SOZEL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "Malzeme takibini kolaylaştırır" },
      { key: "B", text: "Sayımı gereksiz hale getirir" },
      { key: "C", text: "Malzeme kullanımını engeller" },
      { key: "D", text: "Teslimatları durdurur" },
    ],
    correctKey: "A",
  },
  {
    text: "Bir çalışan teslim aldığı malzemenin miktarında kayıtla uyuşmayan bir durum fark ediyor. En uygun davranış hangisidir?",
    dimension: "SOZEL",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "Farkı görmezden gelmek" },
      { key: "B", text: "Durumu kontrol edip bildirmek" },
      { key: "C", text: "Kayıtları değiştirmek" },
      { key: "D", text: "Malzemeyi hemen kullanmak" },
    ],
    correctKey: "B",
  },
  {
    text: "Ambar işlerinde doğru malzemenin doğru miktarda ve doğru kayıtla takip edilmesi önemlidir. Bu ifadeyi en iyi hangisi özetler?",
    dimension: "SOZEL",
    difficulty: "ZOR",
    options: [
      { key: "A", text: "Hız her şeyden önemlidir." },
      { key: "B", text: "Kayıt tutmaya gerek yoktur." },
      { key: "C", text: "Doğru malzeme, miktar ve kayıt birlikte önemlidir." },
      { key: "D", text: "Sayım yalnız yıl sonunda yapılmalıdır." },
    ],
    correctKey: "C",
  },
  {
    text: "Diziyi tamamlayın: A, C, E, G, ...",
    dimension: "SOYUT",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "H" },
      { key: "B", text: "I" },
      { key: "C", text: "J" },
      { key: "D", text: "K" },
    ],
    correctKey: "B",
  },
  {
    text: "Diziyi tamamlayın: ● ■ ● ■ ● ...",
    dimension: "SOYUT",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "●" },
      { key: "B", text: "■" },
      { key: "C", text: "▲" },
      { key: "D", text: "◆" },
    ],
    correctKey: "B",
  },
  {
    text: "2A, 4B, 6C, 8D dizisinde sıradaki öğe hangisidir?",
    dimension: "SOYUT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "9E" },
      { key: "B", text: "10D" },
      { key: "C", text: "10E" },
      { key: "D", text: "12E" },
    ],
    correctKey: "C",
  },
  {
    text: "Bir kuralda A=4, B=8, C=12, D=16 ise F'nin değeri kaçtır?",
    dimension: "SOYUT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "20" },
      { key: "B", text: "24" },
      { key: "C", text: "28" },
      { key: "D", text: "32" },
    ],
    correctKey: "B",
  },
  {
    text: "Diziyi tamamlayın: 3, 7, 12, 18, 25, ...",
    dimension: "SOYUT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "31" },
      { key: "B", text: "32" },
      { key: "C", text: "33" },
      { key: "D", text: "34" },
    ],
    correctKey: "C",
  },
  {
    text: "GH → HG, KL → LK kuralına göre MN nasıl yazılır?",
    dimension: "SOYUT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "MN" },
      { key: "B", text: "NM" },
      { key: "C", text: "MM" },
      { key: "D", text: "NN" },
    ],
    correctKey: "B",
  },
  {
    text: "Her sayı önce 2 ile çarpılıyor, sonra 4 ekleniyor. 8 sayısına uygulanırsa sonuç kaç olur?",
    dimension: "SOYUT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "16" },
      { key: "B", text: "18" },
      { key: "C", text: "20" },
      { key: "D", text: "24" },
    ],
    correctKey: "C",
  },
  {
    text: "Diziyi tamamlayın: Z, W, T, Q, ...",
    dimension: "SOYUT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "N" },
      { key: "B", text: "O" },
      { key: "C", text: "P" },
      { key: "D", text: "M" },
    ],
    correctKey: "A",
  },
  {
    text: "Diziyi tamamlayın: 3, 6, 18, 72, ...",
    dimension: "SOYUT",
    difficulty: "ZOR",
    options: [
      { key: "A", text: "144" },
      { key: "B", text: "216" },
      { key: "C", text: "288" },
      { key: "D", text: "360" },
    ],
    correctKey: "D",
  },
  {
    text: "Dizide sıradaki sayı hangisidir? 3, 5, 8, 13, 21, 34, ...",
    dimension: "SOYUT",
    difficulty: "ZOR",
    options: [
      { key: "A", text: "47" },
      { key: "B", text: "52" },
      { key: "C", text: "55" },
      { key: "D", text: "57" },
    ],
    correctKey: "C",
  },
  {
    text: 'Hangisi "AMB-4827-K" koduyla birebir aynıdır?',
    dimension: "DIKKAT",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "AMB-4827-K" },
      { key: "B", text: "AMB-4287-K" },
      { key: "C", text: "AMB-4827-X" },
      { key: "D", text: "AMB-482T-K" },
    ],
    correctKey: "A",
  },
  {
    text: "Şu dizide A harfi kaç kez geçmektedir? A K A R T A K A M T A",
    dimension: "DIKKAT",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "5" },
      { key: "C", text: "6" },
      { key: "D", text: "7" },
    ],
    correctKey: "B",
  },
    {
    text: "Hangisi diğerlerinden farklı yazılmıştır?",
    dimension: "DIKKAT",
    difficulty: "KOLAY",
    options: [
      { key: "A", text: "MALZEME" },
      { key: "B", text: "MALZEME" },
      { key: "C", text: "MALZEM" },
      { key: "D", text: "MALZEME" },
    ],
    correctKey: "C",
  },
  {
    text: "Kaç kod tamamen aynıdır? Liste 1: AM-214 / ST-583 / DP-407 / RF-625. Liste 2: AM-214 / ST-538 / DP-407 / RF-652.",
    dimension: "DIKKAT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "2" },
      { key: "C", text: "3" },
      { key: "D", text: "4" },
    ],
    correctKey: "B",
  },
  {
    text: 'Hangisi "ST-7315-A4" koduyla aynı değildir?',
    dimension: "DIKKAT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "ST-7315-A4" },
      { key: "B", text: "ST-7315-A4" },
      { key: "C", text: "ST-7135-A4" },
      { key: "D", text: "ST-7315-A4" },
    ],
    correctKey: "C",
  },
  {
    text: "Şu dizide 8 rakamı kaç kez geçmektedir? 8 3 8 5 1 8 6 2 8 4 8",
    dimension: "DIKKAT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "4" },
      { key: "B", text: "5" },
      { key: "C", text: "6" },
      { key: "D", text: "7" },
    ],
    correctKey: "B",
  },
  {
    text: "Hangi sayı grubunun rakam sırası diğerlerinden farklıdır?",
    dimension: "DIKKAT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "47216" },
      { key: "B", text: "47216" },
      { key: "C", text: "42716" },
      { key: "D", text: "47216" },
    ],
    correctKey: "C",
  },
  {
    text: "125, 152, 215, 251, 512, 521 değerlerinin kaç tanesi 5 rakamıyla başlamaktadır?",
    dimension: "DIKKAT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "1" },
      { key: "B", text: "2" },
      { key: "C", text: "3" },
      { key: "D", text: "4" },
    ],
    correctKey: "B",
  },
  {
    text: '"AM7-S25-R" kodunun aynısı hangisidir?',
    dimension: "DIKKAT",
    difficulty: "ORTA",
    options: [
      { key: "A", text: "AM7-S52-R" },
      { key: "B", text: "AM7-S25-R" },
      { key: "C", text: "AM7-R25-S" },
      { key: "D", text: "AM7-S25-K" },
    ],
    correctKey: "B",
  },
  {
    text: "İki satır arasında kaç karakter farklıdır? A: A7K4M8R2T5  B: A7M4M3R2T9",
    dimension: "DIKKAT",
    difficulty: "ZOR",
    options: [
      { key: "A", text: "2" },
      { key: "B", text: "3" },
      { key: "C", text: "4" },
      { key: "D", text: "5" },
    ],
    correctKey: "B",
  },
];