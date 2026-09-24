"use client";

import { useState } from "react";

type Props = {
  assignmentTestId: string;
  href: string;
  started: boolean;
};

export default function StartExamButton({
  assignmentTestId,
  href,
  started,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/exam/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentTestId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Sınav başlatılamadı.");
        return;
      }

      window.location.href = href;
    } catch (error) {
      console.error(error);
      alert("Sınav başlatılırken bir bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleStart}
      disabled={loading}
      style={{
        marginTop: 24,
        padding: "14px 28px",
        fontSize: 16,
        fontWeight: 600,
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
        border: "1px solid #ccc",
        borderRadius: 6,
      }}
    >
      {loading
        ? "Sınav Başlatılıyor..."
        : started
          ? "Sınava Devam Et"
          : "Sınava Başla"}
    </button>
  );
}