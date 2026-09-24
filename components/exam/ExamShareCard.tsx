"use client";

import { useState } from "react";

type Props = {
  candidateName: string;
  positionName: string;
  examPackageName: string;
  accessCode: string;
};

export default function ExamShareCard({
  candidateName,
  positionName,
  examPackageName,
  accessCode,
}: Props) {
  const [message, setMessage] = useState("");

  function getExamUrl() {
    return `${window.location.origin}/aday`;
  }

  async function copyText(
    text: string,
    successMessage: string
  ) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(successMessage);

      window.setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch {
      setMessage(
        "Kopyalama yapılamadı. Tarayıcı izinlerini kontrol edin."
      );
    }
  }

  function copyShortMessage() {
    const text = `${candidateName} – ${positionName} test ataması tamamlanmıştır.

Sınav Paketi: ${examPackageName}
Giriş Kodu: ${accessCode}
Sınav Giriş Linki: ${getExamUrl()}

Testin İK gözetiminde uygulanması ve giriş kodunun sınav başlangıcında adayla paylaşılması rica olunur.`;

    return copyText(
      text,
      "Paylaşım bilgileri kopyalandı."
    );
  }

  function copyEmail() {
    const text = `Konu: Mavi Yaka Aday Test Bilgileri – ${candidateName}

Merhaba,

Aşağıdaki adayın test ataması tamamlanmıştır. Testin İK gözetiminde uygulanması için bilgileri paylaşıyorum.

Aday: ${candidateName}
Pozisyon: ${positionName}
Sınav Paketi: ${examPackageName}
Giriş Kodu: ${accessCode}
Sınav Giriş Linki: ${getExamUrl()}

Adayın sınavı İK gözetiminde gerçekleştirmesi ve giriş kodunun sınav başlangıcında adayla paylaşılması rica olunur.

Teşekkürler.`;

    return copyText(
      text,
      "E-posta metni kopyalandı."
    );
  }

  async function copyCode() {
    return copyText(
      accessCode,
      "Giriş kodu kopyalandı."
    );
  }

  async function copyLink() {
    return copyText(
      getExamUrl(),
      "Sınav giriş linki kopyalandı."
    );
  }

  return (
    <div
      className="card"
      style={{
        marginBottom: 22,
        padding: 28,
        border: "1px solid #dbe4f0",
      }}
    >
      <div
        className="muted"
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.7,
        }}
      >
        SINAV PAYLAŞIM BİLGİLERİ
      </div>

      <h2
        style={{
          marginTop: 7,
          marginBottom: 6,
        }}
      >
        İK Gözetimli Test
      </h2>

      <p
        className="muted"
        style={{
          marginTop: 0,
          lineHeight: 1.6,
        }}
      >
        Bu bilgileri testi uygulayacak İK
        çalışma arkadaşınızla paylaşabilirsiniz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 16,
          marginTop: 22,
        }}
      >
        <div>
          <div className="muted">
            Aday
          </div>
          <strong>{candidateName}</strong>
        </div>

        <div>
          <div className="muted">
            Pozisyon
          </div>
          <strong>{positionName}</strong>
        </div>

        <div>
          <div className="muted">
            Sınav Paketi
          </div>
          <strong>{examPackageName}</strong>
        </div>

        <div>
          <div className="muted">
            Giriş Kodu
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 3,
            }}
          >
            <strong
              style={{
                fontSize: 18,
                letterSpacing: 1,
              }}
            >
              {accessCode}
            </strong>

            <button
              type="button"
              onClick={copyCode}
              style={{
                border: 0,
                background: "transparent",
                cursor: "pointer",
                fontSize: 12,
                textDecoration: "underline",
              }}
            >
              Kopyala
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          padding: 16,
          borderRadius: 10,
          background: "#f8fafc",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          className="muted"
          style={{
            fontSize: 13,
          }}
        >
          Sınav Giriş Linki
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
            marginTop: 5,
          }}
        >
          <code
            style={{
              wordBreak: "break-all",
              fontSize: 13,
            }}
          >
            /aday
          </code>

          <button
            type="button"
            onClick={copyLink}
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              fontSize: 12,
              textDecoration: "underline",
            }}
          >
            Linki Kopyala
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 20,
        }}
      >
        <button
          type="button"
          className="button"
          onClick={copyShortMessage}
        >
          Bilgileri Kopyala
        </button>

        <button
          type="button"
          className="button secondary"
          onClick={copyEmail}
        >
          E-posta Metnini Kopyala
        </button>

        <a
          href="/aday"
          target="_blank"
          rel="noreferrer"
          className="button secondary"
          style={{
            textDecoration: "none",
          }}
        >
          Sınav Girişini Aç
        </a>
      </div>

      {message && (
        <div
          style={{
            marginTop: 14,
            padding: "9px 12px",
            borderRadius: 8,
            background: "#ecfdf5",
            color: "#065f46",
            fontSize: 13,
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}