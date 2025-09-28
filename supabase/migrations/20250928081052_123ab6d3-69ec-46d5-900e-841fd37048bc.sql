-- Add fit_score column to applicants table to store candidate fit percentage
ALTER TABLE public.applicants 
ADD COLUMN fit_score numeric(5,2) CHECK (fit_score >= 0 AND fit_score <= 100);