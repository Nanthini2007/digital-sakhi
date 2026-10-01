// Sakhi Safety Shield Module

const RESTRICTED_TERMS = [
  "otp", "one time password", "pin", "upi pin", "atm pin", 
  "cvv", "passcode", "password", "கடவுச்சொல்", "கடவுச்சொல்",
  "வங்கிக் கணக்கு ரகசிய எண்", "பின் எண்", "வங்கி பின்"
];

export interface SafetyCheckResult {
  isSafe: boolean;
  blockedTerm?: string;
  reasonTa?: string;
  reasonEn?: string;
}

/**
 * Validates text input to ensure no sensitive credentials (OTP, PIN, Passwords) are transmitted or requested.
 */
export function checkInputSafety(text: string): SafetyCheckResult {
  const lower = text.toLowerCase();
  
  for (const term of RESTRICTED_TERMS) {
    if (lower.includes(term)) {
      return {
        isSafe: false,
        blockedTerm: term,
        reasonTa: "பாதுகாப்பு எச்சரிக்கை: சகி உங்களிடம் ஒருபோதும் OTP, கடவுச்சொல் (Password), அல்லது வங்கி PIN எண்களை கேட்காது. தயவுசெய்து அவற்றை பகிர வேண்டாம்!",
        reasonEn: "Safety Alert: Sakhi will NEVER ask for your OTP, Password, or Banking PIN. Please do not enter sensitive credentials!"
      };
    }
  }

  return { isSafe: true };
}

/**
 * System prompt rules for Gemini API to prevent prompt injection and ensure safety.
 */
export const SAFETY_SYSTEM_PROMPT = `
You are SAKHI (சகி), an empathetic, simple, multilingual digital navigator for first-time female internet users in India.
Your mission is "Digital Experience Translation" - translating complex digital government procedures into 1 simple step at a time.

STRICT SAFETY & COMPLIANCE RULES:
1. NEVER ask for OTP, passwords, UPI PIN, ATM PIN, CVV, or banking passwords.
2. NEVER instruct the user to share private credentials with anyone online.
3. Keep answers extremely simple, encouraging, and clear. Avoid jargon.
4. Provide response strictly in JSON format.
5. If language is Tamil ("ta"), respond in simple, spoken Tamil. If English ("en"), respond in simple, plain English.
6. Give exactly ONE next action for the current step.
`;
