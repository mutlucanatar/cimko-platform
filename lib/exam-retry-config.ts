export type ExamRetryConfig = {
  positionName: string;
  firstFormCode: string;
  retryFormCode: string;
  retryPackageName: string;
  waitMonths: number;
};

export const EXAM_RETRY_CONFIGS: ExamRetryConfig[] = [
  {
    positionName: "Yeni Üretim Elemanı",
    firstFormCode: "GY-YUR",
    retryFormCode: "GY-YUR-B",
    retryPackageName:
      "Yeni Üretim Elemanı Tekrar Sınav Uygulaması",
    waitMonths: 3,
  },

  {
    positionName: "Mekanik Bakım Elemanı",
    firstFormCode: "GY-MEK-A",
    retryFormCode: "GY-MEK-B",
    retryPackageName:
      "Mekanik Bakım Elemanı Tekrar Sınav Uygulaması",
    waitMonths: 3,
  },

  {
    positionName: "Elektrik Bakım Elemanı",
    firstFormCode: "GY-ELE-A",
    retryFormCode: "GY-ELE-B",
    retryPackageName:
      "Elektrik Bakım Elemanı Tekrar Sınav Uygulaması",
    waitMonths: 3,
  },

  {
    positionName: "Laboratuvar İşçisi",
    firstFormCode: "GY-KAL-A",
    retryFormCode: "GY-KAL-B",
    retryPackageName:
      "Laboratuvar İşçisi Tekrar Sınav Uygulaması",
    waitMonths: 3,
  },
];

export function getExamRetryConfig(
  positionName: string
): ExamRetryConfig | null {
  return (
    EXAM_RETRY_CONFIGS.find(
      (config) =>
        config.positionName === positionName
    ) ?? null
  );
}