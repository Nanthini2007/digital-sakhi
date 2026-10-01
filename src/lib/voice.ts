// Sakhi Voice Assistant Engine (Speech Recognition & Speech Synthesis)

export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "error";

export interface SpeechRecognitionResultHandler {
  onStart?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike extends ArrayLike<SpeechRecognitionAlternativeLike> {}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
}

// Check if browser supports Web Speech API
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}

let activeRecognition: SpeechRecognitionLike | null = null;

export function startListening(
  language: "ta" | "en",
  handlers: SpeechRecognitionResultHandler
) {
  if (!isSpeechRecognitionSupported()) {
    handlers.onError?.("உங்கள் உலாவி குரல் தேடலை ஆதரிக்கவில்லை (Voice recognition not supported).");
    return;
  }

  const speechWindow = window as SpeechRecognitionWindow;
  const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    handlers.onError?.("உங்கள் உலாவி குரல் தேடலை ஆதரிக்கவில்லை (Voice recognition not supported).");
    return;
  }

  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // ignore
    }
  }

  const recognition = new SpeechRecognition();
  activeRecognition = recognition;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language === "ta" ? "ta-IN" : "en-IN";

  recognition.onstart = () => {
    handlers.onStart?.();
  };

  recognition.onresult = (event: SpeechRecognitionEventLike) => {
    const transcript = event.results[0]?.[0]?.transcript;
    if (transcript) {
      handlers.onResult?.(transcript);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorLike) => {
    handlers.onError?.(event.error || "குரல் பதிவு தோல்வி");
  };

  recognition.onend = () => {
    handlers.onEnd?.();
  };

  try {
    recognition.start();
  } catch (error: unknown) {
    handlers.onError?.(
      error instanceof Error ? error.message : "குரல் பதிவு துவங்க முடியவில்லை"
    );
  }
}

export function stopListening() {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {}
    activeRecognition = null;
  }
}

export function speakText(
  text: string,
  language: "ta" | "en",
  onEnd?: () => void,
  onError?: () => void
) {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return;
  }

  // Stop any ongoing speech
  window.speechSynthesis.cancel();

  // Strip html or markdown formatting for speech
  const cleanText = text.replace(/[*_#`[\]()]/g, "").trim();
  if (!cleanText) {
    onEnd?.();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = language === "ta" ? "ta-IN" : "en-IN";
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;

  const performSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const targetLang = language === "ta" ? "ta" : "en";
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith(targetLang) || v.lang.toLowerCase().includes(targetLang)
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = () => {
      onError?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      performSpeak();
      window.speechSynthesis.onvoiceschanged = null;
    };
    // Trigger voice speak even if event doesn't fire immediately
    performSpeak();
  } else {
    performSpeak();
  }
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
