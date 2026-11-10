// Büyüteç + mesaj noktaları: "mesajı yokla". Tik işareti bilinçli olarak yok; Yokla "güvenli" demez.
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" aria-hidden="true" className={className}>
      <rect width="512" height="512" rx="116" fill="#0b3c49" />
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <circle cx="228" cy="222" r="118" strokeWidth="44" />
        <path d="M318 312 398 392" strokeWidth="58" />
      </g>
      <g fill="#f28c28">
        <circle cx="176" cy="222" r="21" />
        <circle cx="228" cy="222" r="21" />
        <circle cx="280" cy="222" r="21" />
      </g>
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="size-10" />
      <span className="text-3xl font-black tracking-tight text-brand dark:text-white">
        yokla<span className="text-accent">.</span>
      </span>
    </span>
  );
}
