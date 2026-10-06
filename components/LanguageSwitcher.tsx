import { LOCALES, type Locale } from "@/lib/i18n";

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
          className={`flex flex-col items-center justify-center w-10 h-10 rounded-full active:scale-95 transition-transform ${
            l.code === locale ? "bg-white/20 ring-2 ring-signal" : "bg-white/5"
          }`}
        >
          <span aria-hidden="true" className="text-base leading-none">
            {l.flag}
          </span>
          <span className="text-[9px] font-semibold leading-none mt-0.5 text-white/80">
            {l.code.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
}
