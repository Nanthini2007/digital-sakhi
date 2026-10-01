import { NextRequest, NextResponse } from "next/server";
import { dbGetService } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId") || "kmut";
    const language = searchParams.get("language") || "ta";

    const service = await dbGetService(serviceId);

    return NextResponse.json({
      id: service.id,
      name: language === "ta" ? service.nameTa : service.nameEn,
      category: service.category,
      tagline: language === "ta" ? service.taglineTa : service.taglineEn,
      benefitAmount: language === "ta" ? service.benefitAmountTa : service.benefitAmountEn,
      description: language === "ta" ? service.descriptionTa : service.descriptionEn,
      officialUrl: service.officialUrl,
      allowedDomains: service.allowedDomains,
      eligibility: language === "ta" ? service.eligibilityTa : service.eligibilityEn,
      documents: language === "ta" ? service.documentsTa : service.documentsEn,
      stepsCount: service.steps.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch service details";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
