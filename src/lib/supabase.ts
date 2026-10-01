import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { TRUSTED_SERVICES, GovernmentService } from "@/data/schemes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabaseAnonKey || supabaseServiceRoleKey)
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceRoleKey || supabaseAnonKey!)
  : null;

interface SessionRecord {
  id: string;
  language: string;
  created_at: string;
  last_active: string;
}

interface JourneyRecord {
  id: string;
  session_id: string;
  service_id: string;
  current_step: number;
  completed_steps: number[];
  next_action: string;
  status: "active" | "paused" | "completed" | "error";
  updated_at: string;
}

// Local In-Memory Storage Fallback for hackathon demo reliability
const memoryJourneys: Record<string, JourneyRecord> = {};
const memorySessions: Record<string, SessionRecord> = {};

export async function dbGetOrCreateSession(sessionId?: string, language: string = "ta") {
  const sid = sessionId || `session_${Math.random().toString(36).substring(2, 10)}`;
  
  if (supabase) {
    try {
      const { data } = await supabase
        .from("sessions")
        .select("*")
        .eq("id", sid)
        .single();
      
      if (data) return data;

      const { data: newSession } = await supabase
        .from("sessions")
        .insert([{ id: sid, language }])
        .select()
        .single();

      if (newSession) return newSession;
    } catch (e) {
      console.warn("Supabase session lookup error, using memory session:", e);
    }
  }

  if (!memorySessions[sid]) {
    memorySessions[sid] = {
      id: sid,
      language,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    };
  }

  return memorySessions[sid];
}

export async function dbGetService(serviceId: string): Promise<GovernmentService> {
  if (supabase) {
    try {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("id", serviceId)
        .single();
      if (data) return data as GovernmentService;
    } catch {
      // ignore
    }
  }
  return TRUSTED_SERVICES[serviceId] || TRUSTED_SERVICES.kmut;
}

export async function dbSaveJourneyState(
  sessionId: string,
  serviceId: string,
  currentStep: number,
  completedSteps: number[],
  nextAction: string,
  status: "active" | "paused" | "completed" | "error" = "active"
) {
  const journeyId = `journey_${sessionId}_${serviceId}`;
  const record = {
    id: journeyId,
    session_id: sessionId,
    service_id: serviceId,
    current_step: currentStep,
    completed_steps: completedSteps,
    next_action: nextAction,
    status,
    updated_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from("journeys").upsert(record);
    } catch (e) {
      console.warn("Supabase upsert error:", e);
    }
  }

  memoryJourneys[journeyId] = record;
  return record;
}

export async function dbGetJourneyState(sessionId: string, serviceId: string) {
  const journeyId = `journey_${sessionId}_${serviceId}`;
  if (supabase) {
    try {
      const { data } = await supabase
        .from("journeys")
        .select("*")
        .eq("id", journeyId)
        .single();
      if (data) return data;
    } catch {
      // ignore
    }
  }
  return memoryJourneys[journeyId] || null;
}
