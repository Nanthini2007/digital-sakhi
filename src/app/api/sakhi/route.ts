import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { TRUSTED_SERVICES, findServiceByQuery } from "@/data/schemes";
import { checkInputSafety, SAFETY_SYSTEM_PROMPT } from "@/lib/safety";
import { checkRateLimit } from "@/lib/rate-limit";

export interface SakhiApiResponse {
  language: "ta" | "en";
  serviceId: string;
  serviceName: string;
  intent: string;
  reply: string;
  simpleExplanation: string;
  currentStepNumber: number;
  totalSteps: number;
  stepTitle: string;
  nextAction: string;
  actionRequired: string;
  documentsRequired: string[];
  eligibility: string[];
  isFinished: boolean;
  officialUrl: string;
  safety: {
    passed: boolean;
    warningMessage?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const identifier = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous";
    const rateCheck = checkRateLimit(identifier);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment and try again." }, { status: 429 });
    }

    const body = await req.json();
    const {
      userText = "",
      language = "ta",
      action = "chat",
      activeServiceId = null,
      currentStepNumber = 1,
    } = body;

    // 1. Safety Check for sensitive credentials (OTP, Password, Banking PIN)
    const safetyCheck = checkInputSafety(userText);
    if (!safetyCheck.isSafe) {
      return NextResponse.json({
        language,
        serviceId: activeServiceId || "kmut",
        serviceName: "பாதுகாப்பு மையம் (Safety Guard)",
        intent: "security_alert",
        reply: language === "ta" ? safetyCheck.reasonTa : safetyCheck.reasonEn,
        simpleExplanation: language === "ta" 
          ? "சகி உங்கள் பாதுகாப்பிற்காக செயல்படுகிறது. உங்கள் கடவுச்சொல் மற்றும் PIN எண்களை எப்போதும் யாருடனும் பகிராதீர்கள்."
          : "Sakhi works for your safety. Never share your password, OTP, or PIN numbers with anyone.",
        currentStepNumber: 1,
        totalSteps: 1,
        stepTitle: language === "ta" ? "பாதுகாப்பு விழிப்புணர்வு" : "Safety Alert",
        nextAction: language === "ta" ? "உங்கள் கேள்வியை மீண்டும் பதிவு செய்யுங்கள்." : "Please ask your query again safely.",
        actionRequired: language === "ta" ? "பாதுகாப்பான தகவலை மட்டும் பதிவிடவும்." : "Please enter non-sensitive text.",
        documentsRequired: [],
        eligibility: [],
        isFinished: false,
        officialUrl: "https://tn.gov.in",
        safety: {
          passed: false,
          warningMessage: language === "ta" ? safetyCheck.reasonTa : safetyCheck.reasonEn,
        },
      } as SakhiApiResponse);
    }

    // 2. Identify target service
    let service = activeServiceId ? TRUSTED_SERVICES[activeServiceId] : null;
    if (!service) {
      service = findServiceByQuery(userText);
    }

    const stepIndex = Math.min(Math.max(0, currentStepNumber - 1), service.steps.length - 1);
    const step = service.steps[stepIndex];

    // Try Gemini API if API key is provided
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `${SAFETY_SYSTEM_PROMPT}

User Question: "${userText}"
Selected Language: "${language}" (ta = Tamil, en = English)
User Action Context: "${action}"
Matched Scheme Context:
- Scheme Name: ${service.nameEn} / ${service.nameTa}
- Step ${step.stepNumber} of ${step.totalSteps}: ${step.titleEn} / ${step.titleTa}
- Step Description: ${step.descriptionEn} / ${step.descriptionTa}
- Simple Analogy ("I'm Stuck"): ${step.simpleAnalogyEn} / ${step.simpleAnalogyTa}
- Action Required: ${step.actionRequiredEn} / ${step.actionRequiredTa}

Respond ONLY in valid JSON with this format:
{
  "reply": "Clear, encouraging 2-sentence explanation in ${language === 'ta' ? 'simple Tamil' : 'plain English'}",
  "simpleExplanation": "Extremely simple real-world analogy for first-time user in ${language === 'ta' ? 'Tamil' : 'English'}",
  "nextAction": "Exactly ONE simple next step for the user to take right now in ${language === 'ta' ? 'Tamil' : 'English'}"
}`;

        const geminiRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const textOutput = geminiRes.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          return NextResponse.json({
            language,
            serviceId: service.id,
            serviceName: language === "ta" ? service.nameTa : service.nameEn,
            intent: action === "im_stuck" ? "help_stuck" : "guided_journey",
            reply: parsed.reply || (language === "ta" ? step.descriptionTa : step.descriptionEn),
            simpleExplanation: parsed.simpleExplanation || (language === "ta" ? step.simpleAnalogyTa : step.simpleAnalogyEn),
            currentStepNumber: step.stepNumber,
            totalSteps: service.steps.length,
            stepTitle: language === "ta" ? step.titleTa : step.titleEn,
            nextAction: parsed.nextAction || (language === "ta" ? step.actionRequiredTa : step.actionRequiredEn),
            actionRequired: language === "ta" ? step.actionRequiredTa : step.actionRequiredEn,
            documentsRequired: language === "ta" ? service.documentsTa : service.documentsEn,
            eligibility: language === "ta" ? service.eligibilityTa : service.eligibilityEn,
            isFinished: step.stepNumber === service.steps.length,
            officialUrl: service.officialUrl,
            safety: { passed: true },
          } as SakhiApiResponse);
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed or timed out, using trusted fallback knowledge engine:", geminiError);
      }
    }

    // 3. Fallback to deterministic trusted knowledge engine (100% reliable)
    let replyText = "";
    let simpleExplanation = "";
    let nextActionText = "";

    if (action === "im_stuck") {
      replyText = language === "ta"
        ? `கவலைப்படாதீர்கள்! படி ${step.stepNumber}-க்கான எளிய வழிகாட்டுதல்:`
        : `Don't worry! Here is a simple explanation for Step ${step.stepNumber}:`;
      simpleExplanation = language === "ta" ? step.simpleAnalogyTa : step.simpleAnalogyEn;
      nextActionText = language === "ta" ? step.actionRequiredTa : step.actionRequiredEn;
    } else {
      replyText = language === "ta" 
        ? `${service.nameTa} பற்றிய தகவல்கள் இதோ! ${step.descriptionTa}` 
        : `Here are the details for ${service.nameEn}! ${step.descriptionEn}`;
      simpleExplanation = language === "ta" ? step.simpleAnalogyTa : step.simpleAnalogyEn;
      nextActionText = language === "ta" ? step.actionRequiredTa : step.actionRequiredEn;
    }

    return NextResponse.json({
      language,
      serviceId: service.id,
      serviceName: language === "ta" ? service.nameTa : service.nameEn,
      intent: action === "im_stuck" ? "help_stuck" : "guided_journey",
      reply: replyText,
      simpleExplanation,
      currentStepNumber: step.stepNumber,
      totalSteps: service.steps.length,
      stepTitle: language === "ta" ? step.titleTa : step.titleEn,
      nextAction: nextActionText,
      actionRequired: language === "ta" ? step.actionRequiredTa : step.actionRequiredEn,
      documentsRequired: language === "ta" ? service.documentsTa : service.documentsEn,
      eligibility: language === "ta" ? service.eligibilityTa : service.eligibilityEn,
      isFinished: step.stepNumber === service.steps.length,
      officialUrl: service.officialUrl,
      safety: { passed: true },
    } as SakhiApiResponse);

  } catch {
    return NextResponse.json(
      {
        language: "ta",
        serviceId: "kmut",
        serviceName: "பிழை (Error)",
        intent: "error",
        reply: "மன்னிக்கவும், தகவல் பெறுவதில் சிறு சிக்கல் ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
        simpleExplanation: "Please try again in a few moments.",
        currentStepNumber: 1,
        totalSteps: 3,
        stepTitle: "முயற்சிக்கவும்",
        nextAction: "பேசு பொத்தானை அழுத்தவும்.",
        actionRequired: "Retry",
        documentsRequired: [],
        eligibility: [],
        isFinished: false,
        officialUrl: "https://tn.gov.in",
        safety: { passed: true },
      },
      { status: 500 }
    );
  }
}
