-- Remove the unique constraint on application_id to allow multiple applicants per job
ALTER TABLE applicants DROP CONSTRAINT IF EXISTS applicants_application_id_key;

-- Insert 5 mock candidates for Product Marketing Manager role (job_identification = 3)
INSERT INTO applicants ("first name", "last name", email, "CV", status, application_id, role_id)
SELECT 
  candidate.first_name,
  candidate.last_name, 
  candidate.email,
  candidate.cv,
  candidate.status,
  3 as application_id,
  roles.id as role_id
FROM "Open Roles" roles,
(VALUES 
  ('Sarah', 'Johnson', 'sarah.johnson@email.com', 'Experienced marketing professional with 6+ years in B2B SaaS. Led product launches at TechCorp resulting in 40% revenue growth. Expert in go-to-market strategy, content marketing, and customer research.', 1),
  ('Michael', 'Chen', 'michael.chen@email.com', 'Product Marketing Manager with expertise in competitive analysis and positioning. Previously at StartupXYZ where I managed product launches for 3 major features. Strong background in data analysis and customer interviews.', 2),
  ('Emily', 'Rodriguez', 'emily.rodriguez@email.com', 'Marketing strategist with focus on product messaging and sales enablement. 5 years experience at Fortune 500 companies. Proven track record of creating compelling value propositions and supporting sales teams.', 3),
  ('James', 'Thompson', 'james.thompson@email.com', 'Senior Product Marketing professional with deep experience in market research and customer segmentation. Led cross-functional teams to deliver successful product positioning. MBA from top business school.', 4),
  ('Lisa', 'Wang', 'lisa.wang@email.com', 'Product Marketing leader with 7+ years experience in technology sector. Expert in launch planning, competitive intelligence, and marketing automation. Previously increased product adoption by 60% through targeted campaigns.', 2)
) AS candidate(first_name, last_name, email, cv, status)
WHERE roles.job_identification = 3;