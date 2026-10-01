// Safe Operational Event Logger for SAKHI

export type SafeEventType =
  | "journey_started"
  | "intent_detected"
  | "retrieval_completed"
  | "tool_called"
  | "user_stuck"
  | "guidance_recovered"
  | "journey_completed"
  | "error";

interface LogPayload {
  eventType: SafeEventType;
  sessionId?: string;
  journeyId?: string;
  serviceId?: string;
  metadata?: Record<string, unknown>;
}

// Redact sensitive patterns if accidentally passed
function sanitizeMetadata(data?: Record<string, unknown>): Record<string, unknown> {
  if (!data) return {};
  const cleaned: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(data)) {
    const k = key.toLowerCase();
    if (k.includes("otp") || k.includes("pin") || k.includes("password") || k.includes("cvv")) {
      cleaned[key] = "[REDACTED_SENSITIVE]";
    } else {
      cleaned[key] = val;
    }
  }

  return cleaned;
}

export function logSafeEvent({ eventType, sessionId, journeyId, serviceId, metadata }: LogPayload) {
  const sanitized = sanitizeMetadata(metadata);
  const logRecord = {
    timestamp: new Date().toISOString(),
    eventType,
    sessionId: sessionId || "anonymous",
    journeyId: journeyId || "none",
    serviceId: serviceId || "unknown",
    metadata: sanitized,
  };

  console.log(`[SAKHI_AUDIT_LOG] ${eventType.toUpperCase()}:`, JSON.stringify(logRecord));
}
