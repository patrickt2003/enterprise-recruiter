-- Add company profile fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN company_name TEXT,
ADD COLUMN company_values TEXT,
ADD COLUMN company_description TEXT,
ADD COLUMN company_mission TEXT,
ADD COLUMN company_vision TEXT;