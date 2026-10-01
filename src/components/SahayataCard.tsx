"use client";

import React from "react";
import { FileCheck, Printer, CheckCircle2 } from "lucide-react";

interface SahayataCardProps {
  serviceName: string;
  language: "ta" | "en";
  documentsRequired: string[];
  eligibility: string[];
  officialUrl: string;
}

export const SahayataCard: React.FC<SahayataCardProps> = ({
  serviceName,
  language,
  documentsRequired,
  eligibility,
  officialUrl,
}) => {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-rose-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 border-2 border-rose-300 dark:border-rose-800 rounded-3xl p-5 shadow-lg space-y-4 my-4 print:border-black print:bg-white">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-lg">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-rose-950 dark:text-rose-100 text-lg leading-tight">
              {language === "ta" ? "சகாயதா அட்டை (Sahayata Card)" : "Sahayata Summary Card"}
            </h3>
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
              {serviceName}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-slate-700 transition shadow-xs print:hidden"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{language === "ta" ? "அச்சிடுக" : "Print"}</span>
        </button>
      </div>

      {/* Required Documents Checklist */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {language === "ta" ? "தேவையான 3 முக்கிய ஆவணங்கள்:" : "Required Documents Checklist:"}
        </h4>
        <ul className="space-y-1.5">
          {documentsRequired.map((doc, idx) => (
            <li
              key={idx}
              className="flex items-center gap-2 text-slate-800 dark:text-slate-100 text-sm font-semibold bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-rose-100 dark:border-slate-700"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                ✓
              </span>
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Eligibility Summary */}
      <div>
        <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
          {language === "ta" ? "தகுதிகள் (Eligibility Criteria):" : "Eligibility Criteria:"}
        </h4>
        <div className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-rose-100 dark:border-slate-700 space-y-1">
          {eligibility.map((item, idx) => (
            <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              • {item}
            </p>
          ))}
        </div>
      </div>

      {/* Footnote for CSC / Anganwadi */}
      <div className="bg-amber-100 dark:bg-amber-950/60 p-3 rounded-xl text-xs text-amber-900 dark:text-amber-200 font-semibold text-center border border-amber-300 dark:border-amber-800">
        {language === "ta"
          ? "💡 இந்த அட்டையைக் கொண்டு உங்கள் கிராமத்து அங்கன்வாடி அல்லது இ-சேவை மையத்தை அணுகலாம்."
          : "💡 Show this card to your local Anganwadi worker or e-Sevai center operator for instant help."}
      </div>

      <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
        <p>
          {language === "ta"
            ? "திட்ட விதிகள் மாறக்கூடும். சமீபத்திய தகவலுக்கு அதிகாரப்பூர்வ தளத்தைச் சரிபார்க்கவும்."
            : "Scheme rules can change. Check the official portal for the latest information."}
        </p>
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1 font-bold text-emerald-700 underline dark:text-emerald-300"
        >
          {language === "ta" ? "அதிகாரப்பூர்வ ஆதாரம்:" : "Official source:"} {officialUrl}
        </a>
      </div>
    </div>
  );
};
