import { LOCALES, type Locale } from "@/lib/i18n";

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === "fr") {
    return (
      <svg viewBox="0 0 60 36" className="w-6 h-4 rounded-[2px]" aria-hidden="true">
        <rect width="20" height="36" fill="#0055A4" />
        <rect x="20" width="20" height="36" fill="#fff" />
        <rect x="40" width="20" height="36" fill="#EF4135" />
      </svg>
    );
  }
  if (locale === "en") {
    return (
      <svg viewBox="0 0 60 36" className="w-6 h-4 rounded-[2px]" aria-hidden="true">
        <rect width="60" height="36" fill="#00247d" />
        <g stroke="#fff" strokeWidth="6">
          <line x1="0" y1="0" x2="60" y2="36" />
          <line x1="60" y1="0" x2="0" y2="36" />
        </g>
        <g stroke="#cf142b" strokeWidth="2.4">
          <line x1="0" y1="0" x2="60" y2="36" />
          <line x1="60" y1="0" x2="0" y2="36" />
        </g>
        <rect x="24" width="12" height="36" fill="#fff" />
        <rect y="12" width="60" height="12" fill="#fff" />
        <rect x="27" width="6" height="36" fill="#cf142b" />
        <rect y="15" width="60" height="6" fill="#cf142b" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 60 36"
      className="w-6 h-4 rounded-[2px] border border-steel-500/40"
      aria-hidden="true"
    >
      <rect width="60" height="36" fill="#fff" />
      <rect y="4" width="60" height="5" fill="#0038b8" />
      <rect y="27" width="60" height="5" fill="#0038b8" />
      <polygon points="30,11 36,21 24,21" fill="none" stroke="#0038b8" strokeWidth="1.6" />
      <polygon points="30,25 36,15 24,15" fill="none" stroke="#0038b8" strokeWidth="1.6" />
    </svg>
  );
}

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          aria-label={l.label}
          aria-pressed={l.code === locale}
          className={`flex flex-col items-center justify-center gap-0.5 w-10 h-10 rounded-full active:scale-95 transition-transform ${
            l.code === locale ? "bg-white/20 ring-2 ring-signal" : "bg-white/5"
          }`}
        >
          <FlagIcon locale={l.code} />
          <span className="text-[9px] font-semibold leading-none text-white/80">
            {l.code.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
}
