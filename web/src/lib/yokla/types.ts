export type Severity = "yuksek" | "orta" | "dusuk" | "bilgi";

export type Verdict = "dolandirici" | "supheli" | "iz-yok";

export interface Signal {
  id: string;
  severity: Severity;
  message: string;
}

export interface Entities {
  urls: string[];
  phones: string[];
  ibans: string[];
}

export interface ScenarioMatch {
  id: string;
  title: string;
  action: string;
}

export interface YoklaResult {
  verdict: Verdict;
  headline: string;
  findings: string[];
  action: string;
  scenario: ScenarioMatch | null;
  /** "kural": sadece kural motoru, "model": kural motoru + dil modeli */
  source: "kural" | "model";
}

export const SEVERITY_POINTS: Record<Severity, number> = {
  yuksek: 3,
  orta: 2,
  dusuk: 1,
  bilgi: 0,
};

export const VERDICT_RANK: Record<Verdict, number> = {
  "iz-yok": 0,
  supheli: 1,
  dolandirici: 2,
};
