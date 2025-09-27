-- Add missing fields to applicants table for the Kanban board
ALTER TABLE public.applicants 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS role_id uuid;

-- Update status to match our stage system (1=applied, 2=screened, 3=first_interview, 4=second_interview)
-- Keep existing status column but ensure it aligns with our stages

-- Enable RLS on applicants table
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for applicants
CREATE POLICY "Users can view applicants for their roles" 
ON public.applicants 
FOR SELECT 
USING (
  role_id IN (
    SELECT id FROM public."Open Roles" WHERE auth.uid() = id
  )
);

CREATE POLICY "Users can insert applicants for their roles" 
ON public.applicants 
FOR INSERT 
WITH CHECK (
  role_id IN (
    SELECT id FROM public."Open Roles" WHERE auth.uid() = id
  )
);

CREATE POLICY "Users can update applicants for their roles" 
ON public.applicants 
FOR UPDATE 
USING (
  role_id IN (
    SELECT id FROM public."Open Roles" WHERE auth.uid() = id
  )
);

CREATE POLICY "Users can delete applicants for their roles" 
ON public.applicants 
FOR DELETE 
USING (
  role_id IN (
    SELECT id FROM public."Open Roles" WHERE auth.uid() = id
  )
);