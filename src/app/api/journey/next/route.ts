import { NextRequest, NextResponse } from "next/server";
import { dbGetService, dbSaveJourneyState } from "@/lib/supabase";
import { logSafeEvent } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId = "anonymous", serviceId = "kmut", currentStep = 1, language = "ta" } = body;

    const service = await dbGetService(serviceId);
    const nextStepNum = Math.min(currentStep + 1, service.steps.length);
    const stepIdx = nextStepNum - 1;
    const step = service.steps[stepIdx];

    const completed = Array.from(new Set([...Array.from({ length: currentStep }, (_, i) => i + 1)]));
    const isFinished = nextStepNum === service.steps.length && currentStep === service.steps.length;

    const journey = await dbSaveJourneyState(
      sessionId,
      service.id,
      nextStepNum,
      completed,
      language === "ta" ? step.actionRequiredTa : step.actionRequiredEn,
      isFinished ? "completed" : "active"
    );

    logSafeEvent({
      eventType: isFinished ? "journey_completed" : "tool_called",
      sessionId,
      journeyId: journey.id,
      serviceId: service.id,
      metadata: { action: "next_step", nextStepNum },
    });

    return NextResponse.json({
      success: true,
      serviceId: service.id,
      currentStep: nextStepNum,
      totalSteps: service.steps.length,
      completedSteps: completed,
      stepTitle: language === "ta" ? step.titleTa : step.titleEn,
      description: language === "ta" ? step.descriptionTa : step.descriptionEn,
      nextAction: language === "ta" ? step.actionRequiredTa : step.actionRequiredEn,
      isFinished,
      status: isFinished ? "completed" : "active",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to advance journey";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
