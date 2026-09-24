"use client";

import { useState } from "react";

export default function AdaySinavGirisi() {
  const [code, setCode] = useState("");

  function devamEt(e: React.FormEvent) {
    e.preventDefault();

    const temizKod = code.trim().toUpperCase();

    if (!temizKod) {
      alert("Lütfen erişim kodunuzu giriniz.");
      return;
    }

    window.location.href = `/aday/${encodeURIComponent(temizKod)}`;
  }

  return (
    <main className="container">
      <div
        className="card"
        style={{
          maxWidth: 560,
          margin: "70px auto",
          padding: 36,
        }}
      >
        <h1 style={{ marginBottom: 10 }}>Aday Sınav Girişi</h1>

        <p className="muted" style={{ marginBottom: 28 }}>
          Size iletilen sınav erişim kodunu girerek sınavınıza devam
          edebilirsiniz.
        </p>

        <form onSubmit={devamEt}>
          <label
            htmlFor="accessCode"
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Erişim Kodu
          </label>

          <input
            id="accessCode"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Örn: DM-92ZE"
            autoComplete="off"
            style={{
              width: "100%",
              padding: "15px 16px",
              fontSize: 18,
              border: "1px solid #ccd3df",
              borderRadius: 8,
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sınava Devam Et
          </button>
        </form>

        <p
          className="muted"
          style={{
            fontSize: 13,
            marginTop: 22,
            textAlign: "center",
          }}
        >
          Erişim kodunuz size Çimko İnsan Kaynakları tarafından iletilmiştir.
        </p>
      </div>
    </main>
  );
}