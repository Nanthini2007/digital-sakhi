-- SAKHI Supabase PostgreSQL Database Schema

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Sessions Table (Anonymous & Optional Authenticated Users)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language TEXT NOT NULL DEFAULT 'ta',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Services Table (Trusted Government Services Knowledge Base)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  name_ta TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  description_ta TEXT NOT NULL,
  description_en TEXT NOT NULL,
  official_url TEXT NOT NULL,
  allowed_domains JSONB NOT NULL DEFAULT '[]'::jsonb,
  eligibility JSONB NOT NULL DEFAULT '[]'::jsonb,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Knowledge Chunks Table (RAG & Fast Retrieval)
CREATE TABLE IF NOT EXISTS public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id TEXT REFERENCES public.services(id) ON DELETE CASCADE,
  chunk_type TEXT NOT NULL, -- 'eligibility', 'document', 'step', 'faq'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Journeys Table (Active Journey State Tracker)
CREATE TABLE IF NOT EXISTS public.journeys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  service_id TEXT REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  current_step INT NOT NULL DEFAULT 1,
  completed_steps JSONB DEFAULT '[]'::jsonb,
  next_action TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Messages Table (Conversation History)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'sakhi')),
  text TEXT NOT NULL,
  intent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Operational Events Table (Safe Event Logging)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for Fast Query Performance
CREATE INDEX IF NOT EXISTS idx_journeys_session ON public.journeys(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_journey ON public.messages(journey_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);

-- Row Level Security (RLS)
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Anonymous Sessions RLS Policies
CREATE POLICY "Allow public select on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public select on knowledge_chunks" ON public.knowledge_chunks FOR SELECT USING (true);

CREATE POLICY "Allow session access" ON public.sessions FOR ALL USING (true);
CREATE POLICY "Allow journey access" ON public.journeys FOR ALL USING (true);
CREATE POLICY "Allow message access" ON public.messages FOR ALL USING (true);
