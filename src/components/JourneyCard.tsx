"use client";

import React from "react";
import { HelpCircle, Volume2, ArrowRight, ExternalLink, CheckCircle, Sparkles } from "lucide-react";

interface JourneyCardProps {
  language: "ta" | "en";
  serviceName: string;
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  reply: string;
  nextAction: string;
  isFinished: boolean;
  onStuck: () => void;
  onNextStep: () => void;
  onRepeatAudio: () => void;
  onOpenOfficialWeb: () => void;
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  language,
  serviceName,
  stepNumber,
  totalSteps,
  stepTitle,
  reply,
  nextAction,
  isFinished,
  onStuck,
  onNextStep,
  onRepeatAudio,
  onOpenOfficialWeb,
}) => {
  const progressPercent = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 my-3 transition-all duration-300">
      {/* Step Header & Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {serviceName}
          </span>
          <span className="bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded-full font-black text-[11px]">
            {language === "ta" ? `படி ${stepNumber} / ${totalSteps}` : `STEP ${stepNumber} OF ${totalSteps}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Current Step Title & Explanation */}
      <div className="space-y-2">
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-50 leading-snug">
          {stepTitle}
        </h2>
        <p className="text-slate-700 dark:text-slate-200 text-base font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
          {reply}
        </p>
      </div>

      {/* ONE Action Required Box */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-4 space-y-1">
        <span className="text-[11px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
          {language === "ta" ? "அடுத்த செயல்முறை:" : "Next Single Action:"}
        </span>
        <p className="text-amber-950 dark:text-amber-100 font-bold text-base flex items-start gap-2">
          <ArrowRight className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <span>{nextAction}</span>
        </p>
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-2">
        {/* Signature "I'm Stuck" Button */}
        <button
          onClick={onStuck}
          className="w-full py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-md border-2 border-amber-500 transition"
        >
          <HelpCircle className="w-5 h-5 text-slate-950 fill-amber-200" />
          <span>
            {language === "ta" ? "🆘 எனக்கு புரியவில்லை (I'm Stuck)" : "🆘 I Don't Understand (I'm Stuck)"}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* Audio Replay Button */}
          <button
            onClick={onRepeatAudio}
            className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition"
          >
            <Volume2 className="w-4 h-4 text-rose-600" />
            <span>{language === "ta" ? "மீண்டும் கேள்" : "Repeat Voice"}</span>
          </button>

          {/* Next Step Button */}
          <button
            onClick={onNextStep}
            disabled={isFinished}
            className={`py-3 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow-xs ${
              isFinished
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-rose-600 hover:bg-rose-500 text-white"
            }`}
          >
            {isFinished ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{language === "ta" ? "நிறைவடைந்தது" : "Completed"}</span>
              </>
            ) : (
              <>
                <span>{language === "ta" ? "அடுத்த படி" : "Next Step"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Official Website Handoff Button */}
        <button
          onClick={onOpenOfficialWeb}
          className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-300 dark:border-emerald-800 transition"
        >
          <ExternalLink className="w-4 h-4 text-emerald-600" />
          <span>
            {language === "ta"
              ? "அதிகாரப்பூர்வ அரசு தளத்தைத் திறக்கவும்"
              : "Open Official Government Website"}
          </span>
        </button>
      </div>
    </div>
  );
};
