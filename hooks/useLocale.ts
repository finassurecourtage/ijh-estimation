"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getDictionary,
  getDefaultRoomNames,
  getLocaleMeta,
  getStandardObjects,
  type Locale,
} from "@/lib/i18n";

function loadLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "fr" || stored === "en" || stored === "he") return stored;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(loadLocale());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    const meta = getLocaleMeta(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.dir;
  }, [locale, hydrated]);

  function setLocale(next: Locale) {
    setLocaleState(next);
  }

  const meta = getLocaleMeta(locale);

  return {
    locale,
    setLocale,
    dir: meta.dir,
    intl: meta.intl,
    dict: getDictionary(locale),
    standardObjects: getStandardObjects(locale),
    defaultRoomNames: getDefaultRoomNames(locale),
  };
}
