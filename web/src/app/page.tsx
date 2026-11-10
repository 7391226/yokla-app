import { Suspense } from "react";
import Icon, { type IconName } from "@/components/Icon";
import Logo from "@/components/Logo";
import YoklaForm from "@/components/YoklaForm";

const TRUST: { icon: IconName; text: string }[] = [
  { icon: "lock", text: "Mesajın saklanmaz" },
  { icon: "eyeOff", text: "Ekran görüntün telefonundan çıkmaz" },
  { icon: "heart", text: "Ücretsiz, üyelik yok" },
];

const STEPS = [
  { title: "Yapıştır", text: "Sana gelen mesajı, bağlantıyı, numarayı ya da IBAN'ı kopyalayıp buraya yapıştır." },
  { title: "Yokla", text: "Bilinen dolandırıcılık kalıplarıyla karşılaştırır; bağlantıyı ve IBAN'ı inceleriz." },
  { title: "Ne yapacağını öğren", text: "Sonucu, nedenlerini ve atman gereken adımı sade bir dille söyleriz." },
];

const FACTS: { title: string; text: string }[] = [
  {
    title: "Dava ve icra SMS'le başlamaz",
    text: "Hakkında gerçek bir dava ya da icra dosyası varsa resmi tebligatla (PTT ya da e-Tebligat) bildirilir ve e-Devlet'te görünür. \"Dosyanı kapatmak için şu numarayı ara ya da şu hesaba para yatır\" diyen mesaj dolandırıcılıktır.",
  },
  {
    title: "Dosyan var mı, kendin bak",
    text: "e-Devlet'e (turkiye.gov.tr) ya da UYAP Vatandaş Portalı'na kendin girerek hakkında dosya olup olmadığını görebilirsin.",
  },
  {
    title: "Şifre, kart bilgisi ve kod istenmez",
    text: "Bankalar, kurumlar ve şirketler mesajla ya da telefonla şifreni, kartının bilgilerini ya da sana gelen doğrulama kodunu istemez. Tanıdığın biri istese bile kodu kimseye verme.",
  },
  {
    title: "Kimse sana \"yardım\" programı kurdurmaz",
    text: "\"Telefonuna virüs girdi\", \"hesabın tehlikede\" deyip uzaktan bağlanma programı kurduranlar ekranındaki her şeyi görür.",
  },
  {
    title: "Utandırıp para isteyene ödeme yapma",
    text: "\"Ailene, iş yerine ya da savcılığa bildiririz\" diye para isteyenler şantajcıdır; ödedikçe istekleri artar. Mesajları sakla ve polise bildir.",
  },
];

const HELP: { icon: IconName; title: string; text: string; href?: string; cta?: string }[] = [
  {
    icon: "bank",
    title: "Para gönderdiysen ya da kart bilgini verdiysen",
    text: "Hemen bankanı kartının arkasındaki numaradan ara; kartını ve işlemi durdurt.",
  },
  {
    icon: "phone",
    title: "Polise, jandarmaya ya da savcılığa bildir",
    text: "112 Acil Çağrı'yı arayabilir, en yakın karakola ya da Cumhuriyet Başsavcılığı'na giderek şikâyette bulunabilirsin. Mesajları, numaraları ve dekontları silme; yanında götür.",
    href: "tel:112",
    cta: "112'yi ara",
  },
  {
    icon: "flag",
    title: "Sahte siteyi bildir",
    text: "Sahte (oltalama) siteleri Siber Güvenlik Başkanlığı'na (USOM) bildirerek başkalarının da korunmasına yardım et.",
    href: "https://siberguvenlik.gov.tr",
    cta: "siberguvenlik.gov.tr",
  },
];

export default function Home() {
  return (
    <>
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-3">
          <Logo />
          <span className="hidden text-base text-slate-500 sm:block dark:text-slate-400">
            Tıklamadan önce bir yokla
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-4 py-8 sm:py-12">
        <section className="flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-brand sm:text-4xl dark:text-white">
            Tıklamadan, ödemeden, paylaşmadan önce bir yokla.
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Şüpheli bir SMS ya da WhatsApp mesajı mı geldi? Yapıştır; dolandırıcılık izi var mı
            saniyeler içinde söyleyelim.
          </p>
          <ul className="flex flex-wrap gap-2">
            {TRUST.map((t) => (
              <li
                key={t.text}
                className="flex items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1.5 text-base font-medium text-brand dark:bg-white/10 dark:text-slate-200"
              >
                <Icon name={t.icon} className="size-4" />
                {t.text}
              </li>
            ))}
          </ul>
        </section>

        <Suspense>
          <YoklaForm />
        </Suspense>

        <section aria-labelledby="nasil" className="flex flex-col gap-4">
          <h2 id="nasil" className="text-2xl font-bold">
            Nasıl çalışır?
          </h2>
          <ol className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-col dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                  {i + 1}
                </span>
                <span>
                  <span className="block text-lg font-semibold">{s.title}</span>
                  <span className="text-base text-slate-600 dark:text-slate-400">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="bilgi" className="flex flex-col gap-4">
          <h2 id="bilgi" className="text-2xl font-bold">
            Bilmekte fayda var
          </h2>
          <ul className="flex flex-col gap-3">
            {FACTS.map((f) => (
              <li
                key={f.title}
                className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <Icon name="info" className="mt-0.5 size-6 text-accent" />
                <span>
                  <span className="block text-lg font-semibold">{f.title}</span>
                  <span className="text-base text-slate-600 dark:text-slate-400">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="yardim"className="flex flex-col gap-4 rounded-3xl bg-brand p-6 text-white">
          <h2 id="yardim" className="text-2xl font-bold">
            Dolandırıldığını mı düşünüyorsun?
          </h2>
          <ul className="flex flex-col gap-5">
            {HELP.map((h) => (
              <li key={h.title} className="flex gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon name={h.icon} className="size-5" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">{h.title}</span>
                  <span className="text-base text-white/80">{h.text}</span>
                  {h.href && (
                    <a
                      href={h.href}
                      className="self-start text-base font-semibold text-accent-light underline underline-offset-4"
                      {...(h.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                    >
                      {h.cta}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-4 py-6 text-base text-slate-500 dark:text-slate-400">
          <p>
            Yokla bir uyarı aracıdır; bir kurumun ya da kişinin güvenilir olduğuna güvence vermez.
            Para göndermeden önce her zaman kurumu ya da kişiyi bildiğin resmi yoldan doğrula.
          </p>
          <p>
            Yapıştırdığın metin saklanmaz. Yapay zekâ incelemesi kullanıldığında telefon, IBAN, kart
            ve TC kimlik numaraları gönderilmeden önce gizlenir. Ekran görüntüleri telefonundan ya da bilgisayarından
            çıkmadan okunur.
          </p>
        </div>
      </footer>
    </>
  );
}
