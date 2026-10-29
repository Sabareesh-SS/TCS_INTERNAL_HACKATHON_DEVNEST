-- Supabase PostgreSQL Schema for Smart Classroom AV Troubleshooting Assistant
-- Execute this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Classrooms Table
CREATE TABLE IF NOT EXISTS public.classrooms (
    classroom_id VARCHAR(50) PRIMARY KEY,
    room_no VARCHAR(50) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor INT NOT NULL,
    classroom_qr_id VARCHAR(100) UNIQUE NOT NULL,
    room_status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 2. Device Inventory Table
CREATE TABLE IF NOT EXISTS public.device_inventory (
    device_id VARCHAR(50) PRIMARY KEY,
    classroom_id VARCHAR(50) REFERENCES public.classrooms(classroom_id),
    room_no VARCHAR(50) NOT NULL,
    asset_id VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    device_qr_id VARCHAR(100) UNIQUE NOT NULL,
    manual_url TEXT,
    device_status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- 3. Historical Incidents Table
CREATE TABLE IF NOT EXISTS public.av_incidents (
    incident_id VARCHAR(50) PRIMARY KEY,
    room_no VARCHAR(50),
    classroom_id VARCHAR(50),
    device_id VARCHAR(50),
    qr_entry_type VARCHAR(50),
    scanned_qr_id VARCHAR(100),
    device_type VARCHAR(50),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    symptom TEXT,
    power_status VARCHAR(50),
    input_source VARCHAR(50),
    cable_status VARCHAR(50),
    fault_category VARCHAR(100),
    recommended_action_id VARCHAR(100),
    fix_step TEXT,
    resolved VARCHAR(10),
    escalated VARCHAR(10),
    data_origin VARCHAR(50),
    dataset_split VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Diagnostic Step Telemetry
CREATE TABLE IF NOT EXISTS public.diagnostic_steps (
    id BIGSERIAL PRIMARY KEY,
    incident_id VARCHAR(50) NOT NULL,
    classroom_id VARCHAR(50),
    room_no VARCHAR(50),
    step_number INT NOT NULL,
    action_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    result VARCHAR(50),
    escalation_recommended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Technician Escalation Tickets
CREATE TABLE IF NOT EXISTS public.escalation_tickets (
    incident_id VARCHAR(50) PRIMARY KEY,
    classroom_id VARCHAR(50),
    room_no VARCHAR(50),
    device_id VARCHAR(50),
    device_type VARCHAR(50),
    model VARCHAR(100),
    symptom TEXT,
    attempted_steps JSONB DEFAULT '[]'::jsonb,
    escalation_reason TEXT,
    recommended_parts_or_tools TEXT,
    manual_references JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'OPEN',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and grant read/write to anon key for demo apps
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.av_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read classrooms" ON public.classrooms FOR SELECT USING (true);
CREATE POLICY "Allow public insert classrooms" ON public.classrooms FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read device_inventory" ON public.device_inventory FOR SELECT USING (true);
CREATE POLICY "Allow public insert device_inventory" ON public.device_inventory FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read av_incidents" ON public.av_incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert av_incidents" ON public.av_incidents FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read diagnostic_steps" ON public.diagnostic_steps FOR SELECT USING (true);
CREATE POLICY "Allow public insert diagnostic_steps" ON public.diagnostic_steps FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read escalation_tickets" ON public.escalation_tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert escalation_tickets" ON public.escalation_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update escalation_tickets" ON public.escalation_tickets FOR UPDATE USING (true);
