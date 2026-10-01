import { NextRequest, NextResponse } from "next/server";
import { dbGetJourneyState, dbGetService } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId") || "anonymous";
    const serviceId = searchParams.get("serviceId") || "kmut";
    const language = searchParams.get("language") || "ta";

    const journey = await dbGetJourneyState(sessionId, serviceId);
    const service = await dbGetService(serviceId);

    if (!journey) {
      return NextResponse.json({
        sessionId,
        serviceId,
        currentStep: 1,
        completedSteps: [],
        status: "active",
        serviceName: language === "ta" ? service.nameTa : service.nameEn,
      });
    }

    const stepIdx = Math.min(journey.current_step - 1, service.steps.length - 1);
    const step = service.steps[stepIdx];

    return NextResponse.json({
      sessionId: journey.session_id,
      journeyId: journey.id,
      serviceId: journey.service_id,
      serviceName: language === "ta" ? service.nameTa : service.nameEn,
      currentStep: journey.current_step,
      totalSteps: service.steps.length,
      completedSteps: journey.completed_steps || [],
      stepTitle: language === "ta" ? step.titleTa : step.titleEn,
      nextAction: journey.next_action,
      status: journey.status,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch journey state";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
