import { NextRequest, NextResponse } from "next/server";
import { dbGetOrCreateSession, dbGetService, dbSaveJourneyState } from "@/lib/supabase";
import { findServiceByQuery } from "@/data/schemes";
import { checkRateLimit } from "@/lib/rate-limit";
import { logSafeEvent } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, serviceId, userText = "", language = "ta" } = body;

    const rateCheck = checkRateLimit(sessionId || "anonymous");
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait." }, { status: 429 });
    }

    const session = await dbGetOrCreateSession(sessionId, language);
    const service = await dbGetService(serviceId || findServiceByQuery(userText).id);

    const journey = await dbSaveJourneyState(
      session.id,
      service.id,
      1,
      [],
      language === "ta" ? service.steps[0].actionRequiredTa : service.steps[0].actionRequiredEn,
      "active"
    );

    logSafeEvent({
      eventType: "journey_started",
      sessionId: session.id,
      journeyId: journey.id,
      serviceId: service.id,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      journeyId: journey.id,
      serviceId: service.id,
      serviceName: language === "ta" ? service.nameTa : service.nameEn,
      currentStep: 1,
      totalSteps: service.steps.length,
      stepTitle: language === "ta" ? service.steps[0].titleTa : service.steps[0].titleEn,
      description: language === "ta" ? service.steps[0].descriptionTa : service.steps[0].descriptionEn,
      nextAction: language === "ta" ? service.steps[0].actionRequiredTa : service.steps[0].actionRequiredEn,
      status: "active",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to start journey";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
