"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  candidateId: string;
  initialStage: string;
  initialStatus: string;
  initialRejectReason?: string;
};

const stages = [
  ["YENI_BASVURU", "Yeni Başvuru"],
  ["ON_INCELEME", "Ön İnceleme"],
  ["TELEFON_GORUSMESI", "Telefon Görüşmesi"],
  ["TEST_BEKLIYOR", "Test Bekliyor"],
  ["TEST_TAMAMLANDI", "Test Tamamlandı"],
  ["IK_MULAKATI", "İK Mülakatı"],
  ["TEKNIK_MULAKAT", "Teknik Mülakat"],
  ["REFERANS", "Referans"],
  ["TEKLIF", "Teklif"],
  ["ISE_ALINDI", "İşe Alındı"],
];

const statuses = [
  ["AKTIF", "Aktif"],
  ["YEDEK", "Yedek"],
  ["OLUMSUZ", "Olumsuz"],
  ["ISE_ALINDI", "İşe Alındı"],
];

export default function RecruitmentProcess({
  candidateId,
  initialStage,
  initialStatus,
  initialRejectReason = "",
}: Props) {
  const router = useRouter();

  const [stage, setStage] =
    useState(initialStage);

  const [status, setStatus] =
    useState(initialStatus);

  const [note, setNote] = useState("");

  const [rejectReason, setRejectReason] =
    useState(initialRejectReason);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  async function save() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `/api/adaylar/${candidateId}/stage`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            stage,
            status,
            note,
            rejectReason,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error ??
            "Güncelleme yapılamadı."
        );
        return;
      }

      setMessage(
        "İşe alım süreci güncellendi."
      );

      setNote("");

      router.refresh();
    } catch {
      setMessage(
        "Güncelleme sırasında hata oluştu."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="card"
      style={{
        marginBottom: 22,
        padding: 28,
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
        İŞE ALIM SÜRECİ
      </div>

      <h2
        style={{
          marginTop: 7,
          marginBottom: 6,
        }}
      >
        Aday Süreç Yönetimi
      </h2>

      <p
        className="muted"
        style={{
          marginTop: 0,
        }}
      >
        Adayın işe alım aşamasını ve
        durumunu buradan güncelleyebilirsiniz.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 18,
          marginTop: 24,
        }}
      >
        <div>
          <label
            htmlFor="recruitmentStage"
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: 7,
            }}
          >
            Mevcut Aşama
          </label>

          <select
            id="recruitmentStage"
            value={stage}
            onChange={(event) =>
              setStage(event.target.value)
            }
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 8,
              border:
                "1px solid #d1d5db",
              background: "#fff",
            }}
          >
            {stages.map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="candidateStatus"
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: 7,
            }}
          >
            Aday Durumu
          </label>

          <select
            id="candidateStatus"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 8,
              border:
                "1px solid #d1d5db",
              background: "#fff",
            }}
          >
            {statuses.map(
              ([value, label]) => (
                <option
                  key={value}
                  value={value}
                >
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {status === "OLUMSUZ" && (
        <div style={{ marginTop: 18 }}>
          <label
            htmlFor="rejectReason"
            style={{
              display: "block",
              fontWeight: 600,
              marginBottom: 7,
            }}
          >
            Olumsuzluk Nedeni *
          </label>

          <textarea
            id="rejectReason"
            value={rejectReason}
            onChange={(event) =>
              setRejectReason(
                event.target.value
              )
            }
            rows={3}
            placeholder="Olumsuz değerlendirme nedenini yazın."
            style={{
              width: "100%",
              padding: 13,
              borderRadius: 8,
              border:
                "1px solid #d1d5db",
              resize: "vertical",
            }}
          />
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <label
          htmlFor="processNote"
          style={{
            display: "block",
            fontWeight: 600,
            marginBottom: 7,
          }}
        >
          İK Notu
        </label>

        <textarea
          id="processNote"
          value={note}
          onChange={(event) =>
            setNote(event.target.value)
          }
          rows={4}
          placeholder="Bu işlemle ilgili kısa bir not ekleyebilirsiniz."
          style={{
            width: "100%",
            padding: 13,
            borderRadius: 8,
            border:
              "1px solid #d1d5db",
            resize: "vertical",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          marginTop: 18,
        }}
      >
        <button
          type="button"
          className="button"
          disabled={
            saving ||
            (status === "OLUMSUZ" &&
              !rejectReason.trim())
          }
          onClick={save}
        >
          {saving
            ? "Kaydediliyor..."
            : "Süreci Güncelle"}
        </button>

        {message && (
          <span
            className="muted"
            style={{
              fontSize: 13,
            }}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}