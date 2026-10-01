"use client";

import React, { useEffect } from "react";
import { HelpCircle, X, Volume2, ArrowRight, CheckCircle2 } from "lucide-react";

interface StuckModalProps {
  isOpen: boolean;
  language: "ta" | "en";
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  simpleExplanation: string;
  nextAction: string;
  onClose: () => void;
  onRepeatAudio: () => void;
}

export const StuckModal: React.FC<StuckModalProps> = ({
  isOpen,
  language,
  stepNumber,
  totalSteps,
  stepTitle,
  simpleExplanation,
  nextAction,
  onClose,
  onRepeatAudio,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden transform transition-all scale-100"
      >
        {/* Modal Header */}
        <div className="bg-amber-400 text-slate-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-950/10 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h2 className="font-black text-lg leading-none">
                {language === "ta" ? "எனக்கு புரியவில்லை (I'm Stuck)" : "I Need Help Understanding"}
              </h2>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                {language === "ta" ? `படி ${stepNumber} / ${totalSteps}: ${stepTitle}` : `Step ${stepNumber} of ${totalSteps}: ${stepTitle}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-slate-950/10 hover:bg-slate-950/20 flex items-center justify-center text-slate-950 font-bold transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Simple Everyday Analogy */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              💡 {language === "ta" ? "எளிமையான விளக்கம்" : "Simpler Explanation"}
            </h3>
            <p className="text-slate-800 dark:text-slate-100 text-base font-semibold leading-relaxed">
              &quot;{simpleExplanation}&quot;
            </p>
          </div>

          {/* Exactly ONE Action Required */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {language === "ta" ? "இப்போது நீங்கள் செய்ய வேண்டிய ஒரே விஷயம்:" : "Your ONE exact action right now:"}
            </h3>
            <p className="text-emerald-900 dark:text-emerald-100 text-base font-extrabold flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{nextAction}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onRepeatAudio}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition"
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span>{language === "ta" ? "மறுபடியும் குரலில் கேள்" : "Listen Audio Again"}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>{language === "ta" ? "புரிந்தது, தொடரலாம்!" : "Understood, Let's Continue!"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
