import { useState } from "react";
import { LANGUAGES } from "../hooks/useCompanion";

export default function LanguageSelector({ currentLang, setCurrentLang, variant = "trigger" }) {
  const [open, setOpen] = useState(false);

  if (variant === "list") {
    // Desktop sidebar-style structured list, no modal needed.
    return (
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink/50 mb-2 px-1">Language</p>
        <ul>
          {LANGUAGES.map(l => (
            <li key={l.code}>
              <button
                onClick={() => setCurrentLang(l)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium hover:bg-ivory text-left"
              >
                <span>{l.label}</span>
                {l.code === currentLang.code && <span className="text-navy font-bold">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Mobile / header trigger: a labelled dropdown button that opens a bottom sheet.
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-semibold border border-border rounded-md px-3 py-1.5 bg-card"
      >
        {currentLang.label}
        <span className="text-xs text-ink/50">▾</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="relative w-full md:w-96 bg-card rounded-t-2xl md:rounded-xl p-5 pb-8 md:pb-5 z-10">
            <h3 className="font-bold text-lg mb-4">Select your language</h3>
            <ul className="flex flex-col gap-1">
              {LANGUAGES.map(l => (
                <li key={l.code}>
                  <button
                    onClick={() => { setCurrentLang(l); setOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium hover:bg-ivory text-left"
                  >
                    <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      l.code === currentLang.code ? 'border-navy bg-navy' : 'border-border'
                    }`} />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
