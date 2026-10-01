"use client";

import React, { useEffect } from "react";
import { ExternalLink, ShieldCheck, X, AlertTriangle } from "lucide-react";

interface OfficialHandoffModalProps {
  isOpen: boolean;
  officialUrl: string;
  serviceName: string;
  language: "ta" | "en";
  onClose: () => void;
  onConfirm: () => void;
}

export const OfficialHandoffModal: React.FC<OfficialHandoffModalProps> = ({
  isOpen,
  officialUrl,
  serviceName,
  language,
  onClose,
  onConfirm,
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
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-200" />
            <h2 className="font-bold text-base">
              {language === "ta" ? "அதிகாரப்பூர்வ அரசு இணைப்பு" : "Official Government Link"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
            {language === "ta"
              ? `நீங்கள் இப்போது ${serviceName}-ன் அதிகாரப்பூர்வ அரசு போர்ட்டலுக்குச் செல்கிறீர்கள்:`
              : `You are navigating to the official portal for ${serviceName}:`}
          </p>

          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs text-emerald-700 dark:text-emerald-300 font-bold break-all flex items-center gap-2">
            <ExternalLink className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{officialUrl}</span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {language === "ta"
                ? "பாதுகாப்பு நினைவூட்டல்: சகி உங்களிடம் ஒருபோதும் OTP அல்லது கடவுச்சொல் கேட்காது. அதிகாரப்பூர்வ தளத்திலும் கவனமாக தகவல்களை உள்ளிடவும்."
                : "Safety reminder: Sakhi will never store or ask for your bank PINs or passwords."}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {language === "ta" ? "திரும்பு" : "Cancel"}
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>{language === "ta" ? "திறக்கவும் 🌐" : "Open Website 🌐"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
