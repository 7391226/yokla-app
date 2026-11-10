import { analyzeIban } from "./iban";
import { analyzePhone } from "./phone";
import { AWARENESS_TEXT, SCENARIOS, type Scenario } from "./scenarios";
import { extractEntities, fold } from "./text";
import {
  SEVERITY_POINTS,
  type Entities,
  type Signal,
  type Verdict,
  type YoklaResult,
} from "./types";
import { analyzeUrl, isKnownOfficialUrl } from "./url";

export interface RuleAnalysis {
  verdict: Verdict;
  scenario: Scenario | null;
  signals: Signal[];
  entities: Entities;
}

// Sözcük sınırı şart: Türkçe harfler sadeleşince "açılacak" da "acilacak" olur.
const PRESSURE =
  /\b(acil(en)?|hemen|son gun|son saat|24 saat|bugun icinde|aksi takdirde|derhal|vakit kaybetmeden)\b/;

const SEVERITY_ORDER: Signal["severity"][] = ["yuksek", "orta", "dusuk", "bilgi"];

function matchScenario(folded: string): Scenario | null {
  if (AWARENESS_TEXT.test(folded)) return null;

  let best: { scenario: Scenario; hits: number; priority: number } | null = null;
  for (const scenario of SCENARIOS) {
    if (scenario.exclude?.test(folded)) continue;
    const hits = scenario.groups.filter((re) => re.test(folded)).length;
    if (hits < scenario.minGroups) continue;
    const priority = scenario.priority ?? 0;
    if (
      !best ||
      priority > best.priority ||
      (priority === best.priority && hits > best.hits)
    ) {
      best = { scenario, hits, priority };
    }
  }
  return best?.scenario ?? null;
}

export async function analyzeRules(text: string): Promise<RuleAnalysis> {
  const folded = fold(text);
  const entities = extractEntities(text);

  const urlSignals = (await Promise.all(entities.urls.slice(0, 5).map(analyzeUrl))).flat();
  const signals: Signal[] = [
    ...urlSignals,
    ...entities.ibans.flatMap(analyzeIban),
    ...entities.phones.flatMap(analyzePhone),
  ];

  if (PRESSURE.test(folded)) {
    signals.push({
      id: "baski",
      severity: "dusuk",
      message: "Mesaj seni acele ettirmeye çalışıyor; dolandırıcılar düşünmene fırsat vermek istemez.",
    });
  }

  let score = signals.reduce((sum, s) => sum + SEVERITY_POINTS[s.severity], 0);

  let scenario = matchScenario(folded);
  if (scenario) {
    const riskyLink = urlSignals.some((s) => SEVERITY_POINTS[s.severity] >= 2);
    const onlyOfficialLinks =
      entities.urls.length > 0 && entities.urls.every(isKnownOfficialUrl) && !riskyLink;

    if (scenario.needsLink && (entities.urls.length === 0 || onlyOfficialLinks)) {
      // Kalıp var ama tehlikeli link yok: şüpheli say, senaryoyu yine de açıkla.
      score += 2;
    } else {
      score += 5;
    }
  }

  const verdict: Verdict = score >= 5 ? "dolandirici" : score >= 2 ? "supheli" : "iz-yok";
  if (verdict === "iz-yok") scenario = null;

  signals.sort(
    (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
  );

  return { verdict, scenario, signals, entities };
}

const DEFAULT_ACTION: Record<Verdict, string> = {
  dolandirici: "Bağlantıya tıklama, para gönderme, hiçbir bilgi verme. Gönderen numarayı engelle.",
  supheli:
    "Acele etme. Kurumu ya da kişiyi kendi bildiğin numaradan arayıp doğrulamadan işlem yapma.",
  "iz-yok":
    "Bu, güvenli olduğu anlamına gelmez. Para göndermeden ya da bilgi vermeden önce kişiyi veya kurumu bildiğin numaradan ara.",
};

export function composeResult(analysis: RuleAnalysis): YoklaResult {
  const { verdict, scenario, signals } = analysis;

  const headline =
    verdict === "dolandirici"
      ? scenario
        ? `Bu, bilinen bir dolandırıcılık kalıbı: ${scenario.title}.`
        : "Bu mesajda güçlü dolandırıcılık işaretleri var."
      : verdict === "supheli"
        ? scenario
          ? `Şüpheli: ${scenario.title} kalıbına benziyor.`
          : "Şüpheli işaretler var, dikkatli ol."
        : "Bilinen bir dolandırıcılık izi bulamadım.";

  const findings = [
    ...(scenario ? [scenario.explanation] : []),
    ...signals.map((s) => s.message),
  ].slice(0, 3);

  return {
    verdict,
    headline,
    findings,
    action: scenario?.action ?? DEFAULT_ACTION[verdict],
    scenario: scenario ? { id: scenario.id, title: scenario.title, action: scenario.action } : null,
    source: "kural",
  };
}
