// Sakhi Multilingual Configuration Registry

export interface LanguageConfig {
  code: string;       // BCP-47 tag, e.g. "ta-IN"
  isoCode: string;    // ISO 639-1 code, e.g. "ta"
  name: string;       // Native language name
  englishName: string;// "Tamil", "Hindi"
  greeting: string;   // Native greeting
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  {
    code: "ta-IN",
    isoCode: "ta",
    name: "தமிழ்",
    englishName: "Tamil",
    greeting: "வணக்கம் 👋",
  },
  {
    code: "en-IN",
    isoCode: "en",
    name: "English",
    englishName: "English",
    greeting: "Welcome 👋",
  },
];

export function getLanguageConfig(isoCode: string): LanguageConfig {
  return (
    SUPPORTED_LANGUAGES.find(
      (l) => l.isoCode === isoCode || l.code.startsWith(isoCode)
    ) || SUPPORTED_LANGUAGES[0]
  );
}
