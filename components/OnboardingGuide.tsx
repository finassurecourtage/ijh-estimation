"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const SEEN_KEY = "ijh-estimation-onboarding-seen";

const STEP_ICONS = [
  <svg key="camera" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--steel-700)" strokeWidth="2" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>,
  <svg key="ai" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--steel-700)" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4M8 16h.01M16 16h.01" />
  </svg>,
  <svg key="chart" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--steel-700)" strokeWidth="2" aria-hidden="true">
    <path d="M3 3v18h18" />
    <path d="M7 16l4-4 3 3 5-6" />
  </svg>,
];

interface OnboardingGuideProps {
  dict: Dictionary;
  dir: "ltr" | "rtl";
}

export function OnboardingGuide({ dict, dir }: OnboardingGuideProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(SEEN_KEY)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      // ignore
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  return (
    <div
      dir={dir}
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="bg-card w-full sm:max-w-sm sm:rounded-xl rounded-t-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-2">
          <h2 className="text-lg font-bold text-steel-900">{dict.onboarding.title}</h2>
        </div>
        <div className="px-5 pb-4 space-y-4">
          {dict.onboarding.steps.map((step, i) => (
            <div key={step.title} className="flex gap-3 items-start">
              <div className="shrink-0 w-11 h-11 rounded-full bg-steel-100 flex items-center justify-center">
                {STEP_ICONS[i]}
              </div>
              <div>
                <p className="text-sm font-semibold text-steel-900">{step.title}</p>
                <p className="text-xs text-steel-600 mt-0.5">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 pt-0">
          <button
            type="button"
            onClick={dismiss}
            className="w-full bg-signal text-steel-900 font-bold rounded-lg py-3 active:scale-[0.98] transition-transform"
          >
            {dict.onboarding.start}
          </button>
        </div>
      </div>
    </div>
  );
}
