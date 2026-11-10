import { analyzeRules, composeResult } from "@/lib/yokla/engine";
import { modelEnabled, refineWithModel } from "@/lib/yokla/llm";

const MAX_LENGTH = 5000;
const LIMIT_PER_HOUR = 30;

// Prototip için bellek içi sınır; sunucu yeniden başlayınca sıfırlanır.
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT_PER_HOUR;
}

export async function POST(request: Request) {
  // nginx X-Real-IP'yi kendisi yazar; X-Forwarded-For'un ilk değeri istemci tarafından uydurulabilir
  const ip =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ??
    "yerel";
  if (rateLimited(ip)) {
    return Response.json(
      { error: "Çok sık yokladın. Biraz bekleyip tekrar dene." },
      { status: 429 },
    );
  }

  let text: unknown;
  try {
    ({ text } = await request.json());
  } catch {
    return Response.json({ error: "Geçersiz istek." }, { status: 400 });
  }
  if (typeof text !== "string" || text.trim().length < 3) {
    return Response.json({ error: "Yoklamak için bir mesaj, bağlantı, numara ya da IBAN yapıştır." }, { status: 400 });
  }

  const input = text.slice(0, MAX_LENGTH);
  const rules = await analyzeRules(input);
  const result = (modelEnabled() && (await refineWithModel(input, rules))) || composeResult(rules);

  // Metin hiçbir yerde saklanmaz; sadece sonuç döner. İstatistik için günlüğe
  // yalnız sonucun türü yazılır (sunucudaki istatistik betiği okur).
  console.log(
    "YOKLAMA " +
      JSON.stringify({ sonuc: result.verdict, senaryo: result.scenario?.title ?? null, kaynak: result.source }),
  );
  return Response.json(result);
}
