// "@yokla/senaryolar" derlemede ozel.ts ya da ornek.ts olur (bkz. next.config.ts).
// İkisi de aynı şeyi dışa verir; TypeScript için tipi burada yazıyoruz.
declare module "@yokla/senaryolar" {
  export const SCENARIOS: import("./ortak").Scenario[];
}
