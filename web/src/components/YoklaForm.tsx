"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import type { YoklaResult } from "@/lib/yokla/types";

const EXAMPLES = [
  {
    label: "Kargo SMS'i",
    text: "PTT: Kargonuz adres bilgisi eksik oldugu icin teslim edilemedi. 24 saat icinde adresinizi guncelleyin: http://ptt-kargo-takip.xyz/tr",
  },
  {
    label: "\"Numaram değişti\"",
    text: "Anneciğim bu benim yeni numaram, eskisini sil. Acil bir ödeme yapmam lazım, 4.500 TL gönderebilir misin? Yarın veririm. TR33 0006 1005 1978 6457 8413 26",
  },
  {
    label: "Ödül mesajı",
    text: "Tebrikler! Turkcell 25. yil cekilisinde 50 GB internet kazandiniz. Hediyenizi almak icin hemen tiklayin: bit.ly/tc-hediye",
  },
];

const VERDICT_STYLE = {
  dolandirici: {
    box: "border-red-600 bg-red-50 dark:bg-red-950/40",
    badge: "bg-red-600 text-white",
    label: "Dolandırıcılık",
    icon: "octagon",
  },
  supheli: {
    box: "border-amber-500 bg-amber-50 dark:bg-amber-950/40",
    badge: "bg-amber-500 text-black",
    label: "Şüpheli",
    icon: "triangle",
  },
  "iz-yok": {
    box: "border-slate-400 bg-slate-50 dark:bg-slate-900",
    badge: "bg-slate-600 text-white",
    label: "İz bulunamadı",
    icon: "info",
  },
} as const;

export default function YoklaForm() {
  const params = useSearchParams();
  // Android "Paylaş" menüsünden gelen metin (Web Share Target)
  const sharedText = [params.get("title"), params.get("text"), params.get("url")]
    .filter(Boolean)
    .join("\n");
  const [text, setText] = useState(sharedText);
  const [result, setResult] = useState<YoklaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const sharedHandled = useRef(false);

  async function yokla(input: string) {
    const value = input.trim();
    if (!value) {
      setError("Önce yoklamak istediğin mesajı, bağlantıyı ya da numarayı yapıştır.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/yokla", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bir sorun oldu.");
      setResult(data as YoklaResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bir sorun oldu, tekrar dene.");
    } finally {
      setLoading(false);
    }
  }

  // Sonuç ekrana gelince ona kaydır (telefonda klavyeyi de kapat).
  useEffect(() => {
    if (!result || !resultRef.current) return;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const el = resultRef.current;
    const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return () => clearTimeout(t);
  }, [result]);

  // Paylaşılan metin geldiyse sayfa açılır açılmaz yokla.
  useEffect(() => {
    if (sharedHandled.current || !sharedText) return;
    sharedHandled.current = true;
    void yokla(sharedText);
  }, [sharedText]);

  async function pasteFromClipboard() {
    try {
      // Panoda kopyalanmış bir ekran görüntüsü varsa önce onu oku
      const items = await navigator.clipboard.read?.().catch(() => []);
      for (const item of items ?? []) {
        const type = item.types.find((t) => t.startsWith("image/"));
        if (type) {
          await readScreenshot(await item.getType(type));
          return;
        }
      }
      const clip = await navigator.clipboard.readText();
      if (clip) setText(clip);
    } catch {
      setError("Panoya erişilemedi. Metni kutuya basılı tutup \"Yapıştır\" diyebilirsin.");
    }
  }

  async function readScreenshot(file: Blob) {
    setError(null);
    setOcrProgress(0);
    try {
      // Görüntü cihazdan çıkmaz: yazı tanıma tarayıcının içinde yapılır.
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("tur", 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setOcrProgress(Math.round(m.progress * 100));
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const extracted = data.text.trim();
      if (!extracted) {
        setError("Görüntüde okunabilir yazı bulamadım. Daha net bir ekran görüntüsü dene.");
        return;
      }
      setText(extracted);
      await yokla(extracted);
    } catch {
      setError("Ekran görüntüsü okunamadı. Metni kopyalayıp yapıştırmayı dene.");
    } finally {
      setOcrProgress(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function shareWarning(r: YoklaResult) {
    const message =
      `DİKKAT: Bu mesaj ${r.verdict === "dolandirici" ? "dolandırıcılık" : "şüpheli"}` +
      `${r.scenario ? ` (${r.scenario.title})` : ""}. ` +
      "Bağlantıya tıklamayın, para göndermeyin, bilgi vermeyin. " +
      "Yokla ile incelendi: yokla.com.tr";
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
        return;
      } catch {
        // Kullanıcı vazgeçti ya da paylaşım desteklenmiyor; WhatsApp bağlantısına düş.
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  }

  function reset() {
    setText("");
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const busy = loading || ocrProgress !== null;

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void yokla(text);
        }}
        className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-brand/5 sm:p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <label htmlFor="metin" className="text-xl font-semibold">
          Şüpheli mesajı, bağlantıyı, numarayı ya da IBAN&apos;ı buraya yapıştır
        </label>
        <textarea
          id="metin"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onPaste={(e) => {
            const image = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
            if (image && !busy) {
              e.preventDefault();
              void readScreenshot(image);
            }
          }}
          rows={6}
          maxLength={5000}
          placeholder="Örnek: Kargonuz teslim edilemedi, adresinizi güncelleyin: ..."
          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-lg text-slate-900 outline-none transition focus:border-brand focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />

        <button
          type="submit"
          disabled={busy}
          className="flex items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-4 text-xl font-bold text-white shadow transition hover:bg-brand-dark disabled:opacity-60 dark:bg-[#14637a] dark:hover:bg-[#11586b]"
        >
          <Icon name="search" className="size-6" />
          {loading ? "Yokluyorum…" : "Yokla"}
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={pasteFromClipboard}
            disabled={busy}
            className="flex flex-col items-center justify-center gap-1 whitespace-nowrap rounded-2xl border-2 border-slate-200 px-2 py-3 text-base font-semibold hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Icon name="clipboard" />
            Yapıştır
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            className="flex flex-col items-center justify-center gap-1 whitespace-nowrap rounded-2xl border-2 border-slate-200 px-2 py-3 text-base font-semibold hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Icon name="image" />
            {ocrProgress !== null ? (
              `Okunuyor %${ocrProgress}`
            ) : (
              <span className="text-center leading-tight">
                Ekran
                <br />
                görüntüsü
              </span>
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void readScreenshot(file);
            }}
          />
        </div>
        <p className="-mt-1 text-sm text-slate-500 dark:text-slate-400">
          Şimdilik yalnızca yazıları yokluyoruz. Ekran görüntüsü yüklersen içindeki yazıyı okuruz;
          fotoğrafın ya da videonun kendisini incelemeyiz. Fotoğraf ve videolarla yapılan
          dolandırıcılıklara karşı ipuçları yakında eklenecek.
        </p>

        {!result && !text && (
          <div className="flex flex-wrap items-center gap-2 text-base text-slate-600 dark:text-slate-400">
            <span>Denemek için örnek:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setText(ex.text)}
                className="rounded-full border border-slate-300 px-3 py-1 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
              >
                {ex.label}
              </button>
            ))}
          </div>
        )}
      </form>

      {error && (
        <p role="alert" className="rounded-2xl bg-red-100 p-4 text-lg text-red-900 dark:bg-red-950 dark:text-red-100">
          {error}
        </p>
      )}

      {result && (
        <div
          ref={resultRef}
          aria-live="polite"
          className={`scroll-mt-4 flex flex-col gap-5 rounded-3xl border-4 p-6 ${VERDICT_STYLE[result.verdict].box}`}
        >
          <span
            className={`flex items-center gap-2 self-start rounded-full px-4 py-1.5 text-base font-bold uppercase tracking-wide ${VERDICT_STYLE[result.verdict].badge}`}
          >
            <Icon name={VERDICT_STYLE[result.verdict].icon} />
            {VERDICT_STYLE[result.verdict].label}
          </span>
          <h2 className="text-2xl font-bold leading-snug sm:text-3xl">{result.headline}</h2>

          {result.findings.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Neden?</h3>
              <ul className="flex list-disc flex-col gap-2 pl-6 text-lg">
                {result.findings.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-950">
            <h3 className="mb-1 text-lg font-semibold">Ne yapmalısın?</h3>
            <p className="text-xl font-medium">{result.action}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {result.verdict !== "iz-yok" && (
              <button
                type="button"
                onClick={() => shareWarning(result)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 text-lg font-bold text-black shadow hover:brightness-95 sm:flex-none"
              >
                <Icon name="share" />
                Ailemi uyar (paylaş)
              </button>
            )}
            <button
              type="button"
              onClick={reset}
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-400 px-5 py-4 text-lg font-semibold hover:bg-white/60 dark:hover:bg-slate-800"
            >
              <Icon name="restart" />
              Yeni yoklama
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
