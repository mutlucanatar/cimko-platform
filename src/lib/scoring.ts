export type ScoreItem = {
  id: string;
  type: string;
  dimension?: string | null;
  personalityDimId?: string | null;
  direction?: number | null;
  correctKey?: string | null;
  options?: string | null;
};

export type ScoreAnswer = {
  itemId: string;
  selectedKey: string | null;
  isCorrect: boolean | null;
};

type PersonalityRange = {
  dimensionId: string;
  code: string;
  name: string;
  minValue: number;
  maxValue: number;
};

type DimensionName = {
  code: string;
  name: string;
};

function parseOptions(
  options?: string | null
): { key: string; text: string }[] {
  if (!options) return [];

  try {
    const parsed = JSON.parse(options);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      key: String(item.key),
      text: String(item.text ?? ""),
    }));
  } catch {
    return [];
  }
}

function answerMap(answers: ScoreAnswer[]) {
  return new Map(answers.map((answer) => [answer.itemId, answer]));
}

/* -------------------------------------------------------------------------- */
/* YETENEK                                                                     */
/* -------------------------------------------------------------------------- */

export function scoreAbilityTest(
  items: ScoreItem[],
  answers: ScoreAnswer[],
  cutoffScore: number,
  normScore: number
) {
  const answerByItem = answerMap(answers);

  const abilityItems = items.filter(
    (item) => item.type === "COKTAN_SECMELI"
  );

  let correct = 0;
  let answered = 0;
  let blank = 0;

  const dimensionStats: Record<
    string,
    { total: number; correct: number }
  > = {};

  for (const item of abilityItems) {
    const answer = answerByItem.get(item.id);

    const dimension = item.dimension ?? "GENEL";

    if (!dimensionStats[dimension]) {
      dimensionStats[dimension] = {
        total: 0,
        correct: 0,
      };
    }

    dimensionStats[dimension].total += 1;

    if (!answer || answer.selectedKey == null) {
      blank += 1;
      continue;
    }

    answered += 1;

    const isCorrect =
      item.correctKey != null &&
      answer.selectedKey === item.correctKey;

    if (isCorrect) {
      correct += 1;
      dimensionStats[dimension].correct += 1;
    }
  }

  const total = abilityItems.length;

  const totalScore =
    total > 0
      ? Number(((correct / total) * 100).toFixed(2))
      : 0;

  const answeredPercent =
    total > 0
      ? Number(((answered / total) * 100).toFixed(2))
      : 0;

  const dimensionScores: Record<string, number> = {};

  for (const [dimension, stat] of Object.entries(
    dimensionStats
  )) {
    dimensionScores[dimension] =
      stat.total > 0
        ? Number(
            ((stat.correct / stat.total) * 100).toFixed(2)
          )
        : 0;
  }

  const passed = totalScore >= cutoffScore;

  return {
    totalScore,
    correct,
    answered,
    blank,
    total,
    answeredPercent,
    cutoffScore,
    normScore,
    passed,
    result: passed ? "GEÇTİ" : "KALDI",
    dimensionScores,
  };
}

/* -------------------------------------------------------------------------- */
/* KİŞİLİK                                                                     */
/* -------------------------------------------------------------------------- */

export function scorePersonalityTest(
  items: ScoreItem[],
  answers: ScoreAnswer[],
  ranges: PersonalityRange[],
  dimNames: Map<string, DimensionName>
) {
  const answerByItem = answerMap(answers);

  const grouped: Record<
    string,
    {
      total: number;
      answered: number;
      sum: number;
    }
  > = {};

  for (const item of items) {
    if (!item.personalityDimId) {
      continue;
    }

    const dimensionId = item.personalityDimId;

    if (!grouped[dimensionId]) {
      grouped[dimensionId] = {
        total: 0,
        answered: 0,
        sum: 0,
      };
    }

    grouped[dimensionId].total += 1;

    const answer = answerByItem.get(item.id);

    if (!answer || answer.selectedKey == null) {
      continue;
    }

    const options = parseOptions(item.options);
    const index = options.findIndex(
      (option) => option.key === answer.selectedKey
    );

    if (index < 0) {
      continue;
    }

    const optionCount = options.length;

    let value =
  optionCount > 1
    ? 2 + (index / (optionCount - 1)) * 8
    : 6;

const direction =
  item.direction == null ? 1 : item.direction;

if (direction === -1) {
  value = 12 - value;
}

    grouped[dimensionId].answered += 1;
    grouped[dimensionId].sum += value;
  }

  const dimensions: Record<
    string,
    {
      code: string;
      name: string;
      score: number;
      minValue: number | null;
      maxValue: number | null;
      inRange: boolean;
      fit: number;
    }
  > = {};

  let totalFit = 0;
  let fitCount = 0;

  for (const [dimensionId, stat] of Object.entries(grouped)) {
    const info = dimNames.get(dimensionId);

    const code = info?.code ?? dimensionId;
    const name = info?.name ?? dimensionId;

    const score =
      stat.answered > 0
        ? Number(
            (stat.sum / stat.answered).toFixed(2)
          )
        : 0;

    const range = ranges.find(
      (item) => item.dimensionId === dimensionId
    );

    let inRange = true;
    let fit = 100;

    if (range) {
      inRange =
        score >= range.minValue &&
        score <= range.maxValue;

      if (inRange) {
        fit = 100;
      } else if (score < range.minValue) {
        const distance = range.minValue - score;
        const span = Math.max(
          1,
          range.maxValue - range.minValue
        );

        fit = Math.max(
          0,
          100 - (distance / span) * 100
        );
      } else {
        const distance = score - range.maxValue;
        const span = Math.max(
          1,
          range.maxValue - range.minValue
        );

        fit = Math.max(
          0,
          100 - (distance / span) * 100
        );
      }
    }

    const roundedFit = Number(fit.toFixed(2));

    dimensions[dimensionId] = {
      code,
      name,
      score,
      minValue: range?.minValue ?? null,
      maxValue: range?.maxValue ?? null,
      inRange,
      fit: roundedFit,
    };

    totalFit += roundedFit;
    fitCount += 1;
  }

  const fitPercent =
    fitCount > 0
      ? Number((totalFit / fitCount).toFixed(2))
      : 0;

  const outsideRange = Object.values(dimensions)
    .filter((dimension) => !dimension.inRange)
    .map((dimension) => ({
      code: dimension.code,
      name: dimension.name,
      score: dimension.score,
      minValue: dimension.minValue,
      maxValue: dimension.maxValue,
    }));

  return {
    fitPercent,
    dimensions,
    outsideRange,
    result: fitPercent >= 70 ? "UYUMLU" : "DÜŞÜK UYUM",
  };
}

/* -------------------------------------------------------------------------- */
/* TUTUM / ÇALIŞMA YAŞAMI                                                     */
/* -------------------------------------------------------------------------- */

export function scoreAttitudeTest(
  items: ScoreItem[],
  answers: ScoreAnswer[]
) {
  const answerByItem = answerMap(answers);

  let totalValue = 0;
  let answered = 0;
  let totalItems = 0;

  for (const item of items) {
    if (item.type !== "LIKERT3") {
      continue;
    }

    totalItems += 1;

    const answer = answerByItem.get(item.id);

    if (!answer || answer.selectedKey == null) {
      continue;
    }

    const numericValue = Number(answer.selectedKey);

    if (!Number.isFinite(numericValue)) {
      continue;
    }

    let value = numericValue;

    if (item.direction === -1) {
      value = 2 - value;
    }

    totalValue += value;
    answered += 1;
  }

  const maxValue = totalItems * 2;

  const totalScore =
    maxValue > 0
      ? Number(
          ((totalValue / maxValue) * 100).toFixed(2)
        )
      : 0;

  return {
    totalScore,
    answered,
    totalItems,
    result:
      totalScore >= 70
        ? "OLUMLU"
        : "GELİŞİM ALANI",
  };
}