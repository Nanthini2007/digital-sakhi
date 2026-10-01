"use client";

import React from "react";
import { Mic, Loader2, Volume2, Sparkles } from "lucide-react";
import { VoiceState } from "@/lib/voice";

interface MicButtonProps {
  voiceState: VoiceState;
  language: "ta" | "en";
  onClick: () => void;
}

export const MicButton: React.FC<MicButtonProps> = ({
  voiceState,
  language,
  onClick,
}) => {
  const isListening = voiceState === "listening";
  const isThinking = voiceState === "thinking";
  const isSpeaking = voiceState === "speaking";

  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* Outer Pulse Container */}
      <div className="relative flex items-center justify-center">
        {/* Pulsing Aura Rings when listening or speaking */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-rose-400/30 animate-ping" />
            <div className="absolute w-44 h-44 rounded-full bg-pink-400/20 animate-pulse" />
          </>
        )}

        {isSpeaking && (
          <div className="absolute w-36 h-36 rounded-full bg-amber-400/40 animate-pulse" />
        )}

        {/* Main Microphone Button */}
        <button
          onClick={onClick}
          aria-label={language === "ta" ? "குரல் வழி பேசுங்கள்" : "Speak using voice"}
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 border-4 ${
            isListening
              ? "bg-gradient-to-tr from-rose-600 to-red-500 border-white text-white ring-4 ring-rose-400/50 scale-105"
              : isThinking
              ? "bg-gradient-to-tr from-amber-500 to-amber-600 border-white text-white"
              : isSpeaking
              ? "bg-gradient-to-tr from-emerald-600 to-teal-500 border-white text-white ring-4 ring-emerald-300/50"
              : "bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 border-white text-white hover:scale-105 hover:shadow-2xl"
          }`}
        >
          {isThinking ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isSpeaking ? (
            <Volume2 className="w-10 h-10 animate-bounce" />
          ) : isListening ? (
            <Mic className="w-10 h-10 animate-pulse text-white" />
          ) : (
            <Mic className="w-10 h-10" />
          )}

          <span className="text-xs font-bold mt-1 tracking-wide uppercase">
            {isListening
              ? language === "ta"
                ? "கேட்கிறது..."
                : "Listening..."
              : isThinking
              ? language === "ta"
                ? "யோசிக்கிறது..."
                : "Thinking..."
              : isSpeaking
              ? language === "ta"
                ? "பேசுகிறது..."
                : "Speaking..."
              : language === "ta"
              ? "பேசுங்கள்"
              : "Speak"}
          </span>
        </button>
      </div>

      {/* Helpful Audio Status Badge */}
      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>
          {isListening
            ? language === "ta"
              ? "உங்கள் குரலை சகி தெளிவாகக் கேட்கிறது..."
              : "Sakhi is listening to your voice..."
            : isThinking
            ? language === "ta"
              ? "சகி உங்களுக்கான சிறந்த வழியைக் கண்டறிகிறது..."
              : "Sakhi is preparing the simplest answer..."
            : isSpeaking
            ? language === "ta"
              ? "சகி பேசுகிறது. அமைதியாகக் கேட்கவும்."
              : "Sakhi is speaking now."
            : language === "ta"
            ? "பொத்தானை அழுத்தி பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்"
            : "Tap microphone to speak or type below"}
        </span>
      </div>
    </div>
  );
};
