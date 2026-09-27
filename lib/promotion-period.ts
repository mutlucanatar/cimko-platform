export type PromotionPeriodInfo = {
  month: 6 | 12;
  year: number;
  name: string;
};

export function getCurrentPromotionPeriod(
  date = new Date()
): PromotionPeriodInfo {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (month <= 6) {
    return {
      month: 6,
      year,
      name: `HAZIRAN_${year}`,
    };
  }

  return {
    month: 12,
    year,
    name: `ARALIK_${year}`,
  };
}

export function getNextPromotionPeriod(
  period: PromotionPeriodInfo
): PromotionPeriodInfo {
  if (period.month === 6) {
    return {
      month: 12,
      year: period.year,
      name: `ARALIK_${period.year}`,
    };
  }

  return {
    month: 6,
    year: period.year + 1,
    name: `HAZIRAN_${period.year + 1}`,
  };
}