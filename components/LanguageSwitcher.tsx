import { LOCALES, type Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ locale, onChange }: LanguageSwitcherProps) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          aria-label={l.label}
          aria-pressed={l.code === locale}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-lg active:scale-95 transition-transform ${
            l.code === locale ? "bg-white/20 ring-2 ring-signal" : "bg-white/5"
          }`}
        >
          <span aria-hidden="true">{l.flag}</span>
        </button>
      ))}
    </div>
  );
}
