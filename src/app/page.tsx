"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { MicButton } from "@/components/MicButton";
import { JourneyCard } from "@/components/JourneyCard";
import { StuckModal } from "@/components/StuckModal";
import { OfficialHandoffModal } from "@/components/OfficialHandoffModal";
import { SahayataCard } from "@/components/SahayataCard";
import {
  VoiceState,
  startListening,
  stopListening,
  speakText,
  stopSpeaking,
} from "@/lib/voice";
import { SakhiApiResponse } from "@/app/api/sakhi/route";
import { getLanguageConfig } from "@/data/languages";
import { Send, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

const SUGGESTIONS_TA = [
  "மகளிர் உரிமைத் தொகை ₹1000 பெறுவது எப்படி?",
  "கர்ப்பிணி தாய்மார்களுக்கான ₹5000 நிதி உதவி",
  "புதுமைப் பெண் திட்டத்திற்கு என்ன சான்றிதழ்கள் வேண்டும்?",
];

const SUGGESTIONS_EN = [
  "How to get ₹1,000 Magalir Urimai Thittam?",
  "₹5,000 maternity cash benefit for pregnant mothers",
  "What documents are needed for Pudhumai Penn scheme?",
];

export default function SakhiHome() {
  const [language, setLanguage] = useState<string>("ta");
  const [userQuery, setUserQuery] = useState("");
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Session ID persistence
  const sessionIdRef = useRef("anonymous");

  // Active Journey state
  const [activeResponse, setActiveResponse] = useState<SakhiApiResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "sakhi"; text: string; time: string }>
  >([]);

  // Modals
  const [isStuckOpen, setIsStuckOpen] = useState(false);
  const [isOfficialWebOpen, setIsOfficialWebOpen] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const langConfig = getLanguageConfig(language);

  // Initialize Session ID on mount and restore journey state if present
  useEffect(() => {
    let sid = localStorage.getItem("sakhi_session_id");
    if (!sid) {
      sid = `session_${Math.random().toString(36).substring(2, 10)}`;
      localStorage.setItem("sakhi_session_id", sid);
    }
    sessionIdRef.current = sid;

    fetch(`/api/journey/state?sessionId=${sid}&serviceId=kmut&language=ta`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.journeyId && data.currentStep) {
          setCurrentStep(data.currentStep);
        }
      })
      .catch(() => {
        // ignore on initial load
      });
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeResponse, isLoading]);

  // Language Change Handler: syncs active journey step into newly selected language
  const handleLanguageChange = (newLangIso: string) => {
    setLanguage(newLangIso);

    if (activeResponse) {
      processChatQuery(
        `Switch language to ${newLangIso}`,
        currentStep,
        newLangIso
      );
    }
  };

  // Reset journey to clean home state
  const handleReset = () => {
    stopSpeaking();
    stopListening();
    setVoiceState("idle");
    setActiveResponse(null);
    setCurrentStep(1);
    setMessages([]);
    setUserQuery("");
    setErrorMsg(null);
    setIsStuckOpen(false);
    setIsOfficialWebOpen(false);
  };

  // API 1 & 6: Conversational Chat & Journey Start Routine (POST /api/ai/chat)
  const processChatQuery = async (
    text: string,
    targetStep: number = currentStep,
    overrideLang?: string
  ) => {
    if (!text.trim()) return;

    const currentLanguage = overrideLang || language;
    setIsLoading(true);
    setErrorMsg(null);
    setVoiceState("thinking");

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { sender: "user", text, time: timeStr }]);

    try {
      // 1. Initialize/sync journey state via POST /api/journey/start
      const startRes = await fetch("/api/journey/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          serviceId: activeResponse?.serviceId,
          userText: text,
          language: currentLanguage,
        }),
      });

      const startData = await startRes.json();

      // 2. Call POST /api/ai/chat for intelligent guidance
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userText: text,
          language: currentLanguage,
          action: "chat",
          activeServiceId: startData.serviceId || activeResponse?.serviceId || null,
          currentStepNumber: targetStep,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: SakhiApiResponse = await res.json();
      setActiveResponse(data);
      setCurrentStep(data.currentStepNumber);

      setMessages((prev) => [
        ...prev,
        { sender: "sakhi", text: data.reply, time: timeStr },
      ]);

      // Automatic Text-to-Speech playback
      setVoiceState("speaking");
      speakText(
        data.reply,
        currentLanguage === "ta" ? "ta" : "en",
        () => setVoiceState("idle"),
        () => setVoiceState("idle")
      );
    } catch (error: unknown) {
      console.error("Error processing chat query:", error);
      setErrorMsg(
        currentLanguage === "ta"
          ? "மன்னிக்கவும்! தகவல் பெற முடியவில்லை. இணைய இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
          : "Sorry! Unable to fetch response. Please check network connection and retry."
      );
      setVoiceState("idle");
    } finally {
      setIsLoading(false);
      setUserQuery("");
    }
  };

  // API 3: Next Step Handler (POST /api/journey/next)
  const handleNextStep = async () => {
    if (!activeResponse) return;

    setIsLoading(true);
    setErrorMsg(null);
    setVoiceState("thinking");

    try {
      const res = await fetch("/api/journey/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          serviceId: activeResponse.serviceId,
          currentStep,
          language,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch next step");

      const data = await res.json();
      setCurrentStep(data.currentStep);

      const updatedResponse: SakhiApiResponse = {
        ...activeResponse,
        currentStepNumber: data.currentStep,
        stepTitle: data.stepTitle,
        reply: data.description,
        nextAction: data.nextAction,
        isFinished: data.isFinished,
      };

      setActiveResponse(updatedResponse);

      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { sender: "sakhi", text: data.description, time: timeStr },
      ]);

      setVoiceState("speaking");
      speakText(
        data.description,
        language === "ta" ? "ta" : "en",
        () => setVoiceState("idle"),
        () => setVoiceState("idle")
      );
    } catch {
      setErrorMsg("Failed to advance step. Please retry.");
      setVoiceState("idle");
    } finally {
      setIsLoading(false);
    }
  };

  // API 4: "I'm Stuck" Handler (POST /api/journey/stuck)
  const handleStuck = async () => {
    if (!activeResponse) return;

    setIsStuckOpen(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/journey/stuck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId || "anonymous",
          serviceId: activeResponse.serviceId,
          currentStep,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveResponse((prev) =>
          prev
            ? {
                ...prev,
                simpleExplanation: data.simpleExplanation,
                nextAction: data.nextAction,
              }
            : null
        );

        setVoiceState("speaking");
        speakText(
          data.simpleExplanation,
          language === "ta" ? "ta" : "en",
          () => setVoiceState("idle"),
          () => setVoiceState("idle")
        );
      }
    } catch (error) {
      console.warn("Error fetching stuck API:", error);
    }
  };

  // Toggle Voice Input
  const handleMicClick = () => {
    if (voiceState === "speaking") {
      stopSpeaking();
      setVoiceState("idle");
      return;
    }

    if (voiceState === "listening") {
      stopListening();
      setVoiceState("idle");
      return;
    }

    setVoiceState("listening");
    startListening(language === "ta" ? "ta" : "en", {
      onResult: (transcript) => {
        setUserQuery(transcript);
        processChatQuery(transcript, currentStep);
      },
      onError: (err) => {
        console.warn("Speech error:", err);
        setVoiceState("idle");
      },
      onEnd: () => {
        setVoiceState((prev) => (prev === "listening" ? "idle" : prev));
      },
    });
  };

  // Replay speech audio
  const handleRepeatAudio = () => {
    if (!activeResponse) return;
    setVoiceState("speaking");
    speakText(
      isStuckOpen ? activeResponse.simpleExplanation : activeResponse.reply,
      language === "ta" ? "ta" : "en",
      () => setVoiceState("idle"),
      () => setVoiceState("idle")
    );
  };

  // Suggestion pill click
  const handleSuggestionClick = (query: string) => {
    setUserQuery(query);
    processChatQuery(query, 1);
  };

  const suggestions = language === "ta" ? SUGGESTIONS_TA : SUGGESTIONS_EN;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        onReset={handleReset}
      />

      <main className="flex-1 w-full max-w-xl mx-auto p-4 flex flex-col justify-between">
        {/* HOME WELCOME STATE */}
        {!activeResponse && messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center flex-1 my-6 space-y-6 text-center animate-in fade-in duration-300">
            {/* Greeting */}
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
                {language === "ta" ? "அரசு சேவை வழிகாட்டி" : "Government Digital Navigator"}
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {langConfig.greeting}
              </h2>
              <p className="text-lg font-semibold text-rose-700 dark:text-rose-300">
                {language === "ta"
                  ? "உங்களுக்கு என்ன உதவி வேண்டும்?"
                  : "How can Sakhi help you today?"}
              </p>
            </div>

            {/* Central Obvious Microphone Action */}
            <MicButton
              voiceState={voiceState}
              language={language === "ta" ? "ta" : "en"}
              onClick={handleMicClick}
            />

            {/* Prompt Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processChatQuery(userQuery, 1);
              }}
              className="w-full flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-rose-200 dark:border-slate-800 shadow-md focus-within:border-rose-500 transition"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={
                  language === "ta"
                    ? "அல்லது உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்..."
                    : "Or type your query here..."
                }
                className="flex-1 px-3 py-2 bg-transparent text-sm font-semibold focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!userQuery.trim() || isLoading}
                aria-label="Send"
                className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold flex items-center justify-center shadow-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Example Suggestion Chips */}
            <div className="w-full space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                {language === "ta" ? "கேள்வி உதாரணங்கள்:" : "Try asking:"}
              </p>
              <div className="flex flex-col gap-2">
                {suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(sug)}
                    className="w-full p-3 text-left rounded-xl bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-2xs hover:border-rose-300 transition flex items-center justify-between group"
                  >
                    <span>{sug}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-500 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE CONVERSATION & GUIDED JOURNEY */}
        {(activeResponse || messages.length > 0 || isLoading || errorMsg) && (
          <div className="space-y-4 pb-24">
            {/* Mic Bar during active chat */}
            <div className="sticky top-16 z-30 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm py-2">
              <MicButton
                voiceState={voiceState}
                language={language === "ta" ? "ta" : "en"}
                onClick={handleMicClick}
              />
            </div>

            {/* ERROR STATE CARD */}
            {errorMsg && (
              <div className="bg-rose-100 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-800 rounded-2xl p-4 flex items-start gap-3 shadow-md animate-in fade-in">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-bold text-rose-900 dark:text-rose-100 text-sm">
                    {language === "ta" ? "பிழை ஏற்பட்டது" : "Error Occurred"}
                  </h4>
                  <p className="text-xs text-rose-800 dark:text-rose-200 mt-1 font-medium">
                    {errorMsg}
                  </p>
                  <button
                    onClick={() => processChatQuery(userQuery || "retry", currentStep)}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-rose-500 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === "ta" ? "மீண்டும் முயற்சி செய்" : "Retry Request"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* LOADING STATE CARD */}
            {isLoading && (
              <div className="w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-3xl p-5 shadow-lg space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400 animate-spin" />
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {language === "ta" ? "சகி சிந்தித்துக் கொண்டிருக்கிறது..." : "Sakhi is preparing guidance..."}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {language === "ta" ? "எளிமையான தகவல்கள் தயாராகின்றன" : "Translating digital steps"}
                    </p>
                  </div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/2" />
              </div>
            )}

            {/* Active Guided Step Card */}
            {activeResponse && !isLoading && (
              <JourneyCard
                language={language === "ta" ? "ta" : "en"}
                serviceName={activeResponse.serviceName}
                stepNumber={activeResponse.currentStepNumber}
                totalSteps={activeResponse.totalSteps}
                stepTitle={activeResponse.stepTitle}
                reply={activeResponse.reply}
                nextAction={activeResponse.nextAction}
                isFinished={activeResponse.isFinished}
                onStuck={handleStuck}
                onNextStep={handleNextStep}
                onRepeatAudio={handleRepeatAudio}
                onOpenOfficialWeb={() => setIsOfficialWebOpen(true)}
              />
            )}

            {/* Offline Printable Sahayata Summary Card */}
            {activeResponse && !isLoading && activeResponse.documentsRequired.length > 0 && (
              <SahayataCard
                serviceName={activeResponse.serviceName}
                language={language === "ta" ? "ta" : "en"}
                documentsRequired={activeResponse.documentsRequired}
                eligibility={activeResponse.eligibility}
                officialUrl={activeResponse.officialUrl}
              />
            )}

            {/* Conversation Stream Log */}
            <div className="space-y-3 pt-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs font-semibold shadow-2xs ${
                      msg.sender === "user"
                        ? "bg-rose-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] opacity-70 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Text Input Footer during Active Chat */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processChatQuery(userQuery, currentStep);
              }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 border-t border-slate-200 dark:border-slate-800 max-w-xl mx-auto flex items-center gap-2 shadow-lg"
            >
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder={
                  language === "ta"
                    ? "கேள்வியைப் பதிவிடவும்..."
                    : "Type a follow-up question..."
                }
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!userQuery.trim() || isLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition"
              >
                {language === "ta" ? "அனுப்பு" : "Send"}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Signature "I'm Stuck" Modal */}
      {activeResponse && (
        <StuckModal
          isOpen={isStuckOpen}
          language={language === "ta" ? "ta" : "en"}
          stepNumber={activeResponse.currentStepNumber}
          totalSteps={activeResponse.totalSteps}
          stepTitle={activeResponse.stepTitle}
          simpleExplanation={activeResponse.simpleExplanation}
          nextAction={activeResponse.nextAction}
          onClose={() => setIsStuckOpen(false)}
          onRepeatAudio={handleRepeatAudio}
        />
      )}

      {/* Official Government Website Handoff Modal */}
      {activeResponse && (
        <OfficialHandoffModal
          isOpen={isOfficialWebOpen}
          officialUrl={activeResponse.officialUrl}
          serviceName={activeResponse.serviceName}
          language={language === "ta" ? "ta" : "en"}
          onClose={() => setIsOfficialWebOpen(false)}
          onConfirm={() => {
            setIsOfficialWebOpen(false);
            window.open(activeResponse.officialUrl, "_blank", "noopener,noreferrer");
          }}
        />
      )}
    </div>
  );
}
