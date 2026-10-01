"use client";

import React from "react";
import { Globe, RotateCcw, HeartHandshake } from "lucide-react";
import { SUPPORTED_LANGUAGES, getLanguageConfig } from "@/data/languages";

interface HeaderProps {
  language: string;
  onLanguageChange: (langIsoCode: string) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onReset,
}) => {
  const currentLang = getLanguageConfig(language);

  return (
    <header className="w-full bg-linear-to-r from-rose-600 via-pink-600 to-amber-600 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner">
            <HeartHandshake className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">
                SAKHI <span className="text-amber-200 text-lg">{currentLang.name}</span>
              </h1>
              <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-rose-100 font-medium leading-tight mt-0.5">
              {language === "ta"
                ? "உங்கள் குரல். உங்கள் மொழி. உங்கள் டிஜிட்டல் சுதந்திரம்."
                : "Your Voice. Your Language. Your Digital Independence."}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Reset button */}
          <button
            onClick={onReset}
            title={language === "ta" ? "துவக்கம்" : "Reset"}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition text-white text-xs font-semibold flex items-center gap-1 border border-white/20"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Multilingual Selector */}
          <div className="relative flex items-center bg-amber-400 text-slate-950 rounded-full px-2.5 py-1 text-xs font-extrabold shadow-sm border border-amber-300">
            <Globe className="w-3.5 h-3.5 mr-1 text-slate-950 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-slate-950 font-black focus:outline-hidden cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.isoCode} value={lang.isoCode} className="bg-white text-slate-900 font-semibold">
                  {lang.name} ({lang.englishName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
