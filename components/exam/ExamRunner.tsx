"use client";

import { useEffect, useMemo, useState } from "react";

type ExamOption = {
  key: string;
  text: string;
  imageUrl?: string;
};

type ExamItem = {
  id: string;
  text: string;
  imageUrl?: string;
  type: string;
  options: ExamOption[];
};

type NextTest = {
  assignmentTestId: string;
  testFormId?: string;
  testFormName?: string;
};

type CompleteResponse = {
  success?: boolean;
  alreadyCompleted?: boolean;
  examCompleted?: boolean;
  completedAt?: string | null;
  nextTest?: NextTest | null;
  error?: string;
};

type ExamRunnerProps = {
  assignmentId: string;
  assignmentTestId: string;
  startedAt?: string | null;
  sectionDeadline?: string | null;

  candidateName: string;
  testName: string;
  testKind: string;

  sectionName: string;
  currentSection: number;
  totalSections: number;

  durationMin: number;
  items: ExamItem[];
  initialAnswers?: Record<string, string>;
};
export default function ExamRunner({
  assignmentId,
  assignmentTestId,
  startedAt,
  sectionDeadline,
  candidateName,
  testName,
  testKind,
  sectionName,
  currentSection,
  totalSections,
  durationMin,
  items,
  initialAnswers = {},
}: ExamRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] =
    useState<Record<string, string>>(initialAnswers);

  const [secondsLeft, setSecondsLeft] =
    useState(durationMin * 60);

  const [finished, setFinished] =
    useState(false);

  const [completing, setCompleting] =
    useState(false);

  const currentItem = items[currentIndex];

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const progress = items.length
    ? ((currentIndex + 1) / items.length) * 100
    : 0;

  /**
   * Sıradaki teste geçer.
   *
   * Aynı /sinav adresini koruyup query string içerisine
   * sıradaki AssignmentTest ID'sini ekliyoruz.
   *
   * Örnek:
   * /aday/CMK-F1C0/sinav
   *        ↓
   * /aday/CMK-F1C0/sinav?test=abc123
   */
  function goToNextTest(nextTest: NextTest) {
    if (!nextTest?.assignmentTestId) {
      setFinished(true);
      return;
    }

    const url = new URL(window.location.href);

    url.searchParams.set(
      "test",
      nextTest.assignmentTestId
    );

    window.location.href =
      `${url.pathname}${url.search}`;
  }

  /**
   * /api/exam/complete sonucunu işler.
   */
  function handleCompleteResponse(
    data: CompleteResponse
  ) {
    // Sıradaki test varsa ona geç.
    if (
      data.examCompleted === false &&
      data.nextTest?.assignmentTestId
    ) {
      goToNextTest(data.nextTest);
      return;
    }

    // Sıradaki test yoksa sınav tamamen bitmiştir.
    setFinished(true);
  }
/**
 * Mevcut bölümü tamamlar.
 *
 * Test içerisinde başka bölüm varsa currentSection artırılır
 * ve sayfa yeni bölümle yeniden yüklenir.
 *
 * Son bölümse gerçek test tamamlama işlemine geçilir.
 */
async function completeSection() {
  if (completing || finished) {
    return;
  }

  /*
   * Tek bölümlü testlerde doğrudan testi tamamla.
   * Örneğin Genel Yetenek.
   */
  if (totalSections <= 1) {
    await completeExam();
    return;
  }

  setCompleting(true);

  try {
    const response = await fetch(
      "/api/exam/section-complete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentTestId,
          currentSection,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ||
          "Bölüm tamamlanamadı."
      );
    }

    /*
     * Aynı testte başka bölüm varsa:
     * API currentSection değerini DB'de artırdı.
     *
     * Sayfayı yeniden yüklediğimizde server component
     * yeni currentSection değerini okuyacak.
     */
    if (
      data.testCompleted === false &&
      typeof data.nextSection === "number"
    ) {
      window.location.reload();
      return;
    }

    /*
     * Son bölüme ulaştık.
     *
     * setCompleting(false) yapıyoruz çünkü completeExam()
     * başında completing kontrolü var.
     */
    setCompleting(false);

    await completeExam();
  } catch (error) {
    console.error(
      "Bölüm tamamlama hatası:",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Bölüm tamamlanamadı. Lütfen tekrar deneyiniz."
    );

    setCompleting(false);
  }
}
  /**
   * Testi tamamlar.
   */
  async function completeExam() {
    if (completing || finished) {
      return;
    }

    setCompleting(true);

    try {
      const response = await fetch(
        "/api/exam/complete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignmentTestId,
          }),
        }
      );

      const data =
        (await response.json()) as CompleteResponse;

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Sınav tamamlanamadı."
        );
      }

      handleCompleteResponse(data);
    } catch (error) {
      console.error(
        "Sınav tamamlama hatası:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Sınav tamamlanamadı. Lütfen tekrar deneyiniz."
      );
    } finally {
      setCompleting(false);
    }
  }

  /**
   * Test süresi.
   *
   * Süre dolduğunda da normal tamamlanma
   * akışı çalışır. Yani ilk test bittiyse
   * ikinci teste geçilir.
   */
  useEffect(() => {
    if (!startedAt || finished) {
      return;
    }

    const calculateRemaining = () => {
      const elapsed = Math.floor(
        (
          Date.now() -
          new Date(startedAt).getTime()
        ) / 1000
      );

      return Math.max(
        0,
        durationMin * 60 - elapsed
      );
    };

    setSecondsLeft(calculateRemaining());

    const timer = window.setInterval(() => {
      const remaining =
        calculateRemaining();

      if (remaining <= 0) {
        setSecondsLeft(0);
        window.clearInterval(timer);

        void completeExam();

        return;
      }

      setSecondsLeft(remaining);
    }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    startedAt,
    durationMin,
    finished,
    assignmentTestId,
  ]);

  if (!currentItem) {
    return (
      <main className="container">
        <div
          className="card"
          style={{
            marginTop: 40,
            padding: 30,
          }}
        >
          <h1>
            Sınavda soru bulunamadı
          </h1>
        </div>
      </main>
    );
  }

  if (finished) {
  return (
    <main className="container">
      <div
        className="card"
        style={{
          maxWidth: 720,
          margin: "70px auto",
          padding: 40,
          textAlign: "center",
        }}
      >
        <h1>Sınavınız tamamlandı</h1>

        <p style={{ marginTop: 16 }}>
          {candidateName}, sınavınızı tamamladınız.
        </p>

        <p
          className="muted"
          style={{ marginTop: 24 }}
        >
          Sonuçlarınız İnsan Kaynakları tarafından değerlendirilecektir.
        </p>
      </div>
    </main>
  );
}
    const minutes = Math.floor(
    secondsLeft / 60
  )
    .toString()
    .padStart(2, "0");

  const seconds = (
    secondsLeft % 60
  )
    .toString()
    .padStart(2, "0");

  async function selectAnswer(
    key: string
  ) {
    const nextAnswers = {
      ...answers,
      [currentItem.id]: key,
    };

    setAnswers(nextAnswers);

    try {
      const response = await fetch(
        "/api/exam/answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignmentTestId,
            itemId: currentItem.id,
            selectedKey: key,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Cevap kaydedilemedi."
        );
      }
    } catch (error) {
      console.error(
        "Cevap kaydetme hatası:",
        error
      );

      alert(
        "Cevabınız kaydedilemedi. Lütfen tekrar deneyiniz."
      );
    }
  }

  function previousQuestion() {
    setCurrentIndex((value) =>
      Math.max(0, value - 1)
    );
  }

  function nextQuestion() {
    setCurrentIndex((value) =>
      Math.min(
        items.length - 1,
        value + 1
      )
    );
  }

  return (
    <main className="container">
      <div
        style={{
          maxWidth: 920,
          margin: "30px auto",
        }}
      >
        {/* Üst bilgi */}
        <div
          className="card"
          style={{
            padding: 24,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  marginBottom: 6,
                }}
              >
                {testName}
              </h1>

              <p
                className="muted"
                style={{ margin: 0 }}
              >
                {candidateName}
              </p>

              <p
                className="muted"
                style={{
                  margin: "5px 0 0",
                }}
              >
                {sectionName}
              </p>
            </div>

            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: "12px 18px",
                textAlign: "center",
                minWidth: 120,
              }}
            >
              <div
                className="muted"
                style={{
                  fontSize: 12,
                }}
              >
                Kalan Süre
              </div>

              <strong
                style={{
                  display: "block",
                  fontSize: 24,
                  marginTop: 3,
                }}
              >
                {minutes}:{seconds}
              </strong>
            </div>
          </div>

          {/* İlerleme */}
          <div style={{ marginTop: 22 }}>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: 14,
                marginBottom: 7,
              }}
            >
              <span>
                Soru {currentIndex + 1} /{" "}
                {items.length}
              </span>

              <span>
                {answeredCount} cevaplandı
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: 8,
                background: "#e5e7eb",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#1e3a8a",
                  transition:
                    "width 0.2s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Soru */}
        <div
          className="card"
          style={{
            padding: 30,
          }}
        >
          <div
            className="muted"
            style={{
              marginBottom: 12,
            }}
          >
            Soru {currentIndex + 1}
          </div>

          <h2
            style={{
              fontSize: 22,
              lineHeight: 1.5,
              marginBottom: 22,
            }}
          >
            {currentItem.text}
          </h2>

          {currentItem.imageUrl && (
            <img
              src={currentItem.imageUrl}
              alt=""
              style={{
                maxWidth: "100%",
                borderRadius: 8,
                marginBottom: 22,
              }}
            />
          )}

          <div>
            {currentItem.options.map(
              (option) => {
                const selected =
                  answers[
                    currentItem.id
                  ] === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() =>
                      selectAnswer(
                        option.key
                      )
                    }
                    disabled={completing}
                    style={{
                      width: "100%",
                      display: "block",
                      textAlign: "left",
                      padding: 18,
                      marginBottom: 12,
                      borderRadius: 10,
                      border: selected
                        ? "2px solid #1e3a8a"
                        : "1px solid #d1d5db",
                      background: selected
                        ? "#eef2ff"
                        : "#ffffff",
                      cursor: completing
                        ? "default"
                        : "pointer",
                      fontSize: 16,
                      opacity:
                        completing
                          ? 0.7
                          : 1,
                    }}
                  >
                    <strong
                      style={{
                        marginRight: 10,
                      }}
                    >
                      {option.key}.
                    </strong>

                    {option.text}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Navigasyon */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            gap: 12,
            marginTop: 18,
          }}
        >
          <button
            type="button"
            onClick={
              previousQuestion
            }
            disabled={
              currentIndex === 0 ||
              completing
            }
            style={{
              padding:
                "13px 22px",
              cursor:
                currentIndex === 0 ||
                completing
                  ? "default"
                  : "pointer",
              opacity:
                currentIndex === 0 ||
                completing
                  ? 0.5
                  : 1,
            }}
          >
            ← Önceki
          </button>

          {currentIndex <
          items.length - 1 ? (
            <button
              type="button"
              onClick={
                nextQuestion
              }
              disabled={completing}
              style={{
                padding:
                  "13px 22px",
                cursor:
                  completing
                    ? "default"
                    : "pointer",
                fontWeight: 600,
                opacity:
                  completing
                    ? 0.5
                    : 1,
              }}
            >
              Sonraki →
            </button>
          ) : (
            <button
              type="button"
              onClick={completeSection}
              disabled={completing}
              style={{
                padding:
                  "13px 22px",
                cursor:
                  completing
                    ? "default"
                    : "pointer",
                fontWeight: 600,
                opacity:
                  completing
                    ? 0.7
                    : 1,
              }}
            >
              {completing
  ? "İşleniyor..."
  : testKind === "KISILIK" &&
      currentSection < totalSections - 1
    ? "Sonraki Bölüme Geç →"
    : testKind === "KISILIK"
      ? "ÇKE'yi Tamamla"
      : "Sınavı Tamamla"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}