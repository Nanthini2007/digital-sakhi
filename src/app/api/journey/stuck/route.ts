import { NextRequest, NextResponse } from "next/server";
import { dbGetService } from "@/lib/supabase";
import { logSafeEvent } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId = "anonymous", serviceId = "kmut", currentStep = 1, language = "ta" } = body;

    const service = await dbGetService(serviceId);
    const stepIdx = Math.min(Math.max(0, currentStep - 1), service.steps.length - 1);
    const step = service.steps[stepIdx];

    logSafeEvent({
      eventType: "user_stuck",
      sessionId,
      serviceId: service.id,
      metadata: { currentStep },
    });

    return NextResponse.json({
      success: true,
      serviceId: service.id,
      currentStep: step.stepNumber,
      totalSteps: service.steps.length,
      stepTitle: language === "ta" ? step.titleTa : step.titleEn,
      simpleExplanation: language === "ta" ? step.simpleAnalogyTa : step.simpleAnalogyEn,
      nextAction: language === "ta" ? step.actionRequiredTa : step.actionRequiredEn,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to process stuck request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
