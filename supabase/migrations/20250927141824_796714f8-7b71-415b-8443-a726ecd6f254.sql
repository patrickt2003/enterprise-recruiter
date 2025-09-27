-- Fix applicants with null role_id by setting it based on their application_id
UPDATE applicants 
SET role_id = (
  SELECT id 
  FROM "Open Roles" 
  WHERE job_identification = applicants.application_id
)
WHERE role_id IS NULL;