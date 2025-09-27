-- Insert 2 mock applicants for each job posting

-- Lead Software Engineer (application_id: 1)
INSERT INTO applicants ("first name", "last name", email, "CV", application_id, status, role_id) VALUES
('Sarah', 'Johnson', 'sarah.johnson@email.com', 'Experienced full-stack developer with 8+ years in React, Node.js, and AWS. Led teams of 5+ engineers and architected scalable microservices for fintech applications. Strong background in system design and mentoring junior developers.', 1, 1, '558c5553-df23-4e46-9168-2273d252ee86'),
('Michael', 'Chen', 'michael.chen@email.com', 'Senior software engineer with expertise in TypeScript, Python, and distributed systems. 7 years experience building high-performance applications serving millions of users. Passionate about code quality, testing, and technical leadership.', 1, 2, '558c5553-df23-4e46-9168-2273d252ee86');

-- Business Development Representative (application_id: 2)
INSERT INTO applicants ("first name", "last name", email, "CV", application_id, status, role_id) VALUES
('Emma', 'Williams', 'emma.williams@email.com', 'Results-driven sales professional with 3 years experience in B2B lead generation. Consistently exceeded quota by 120%+ and generated $2M+ in pipeline. Expert in Salesforce, cold outreach, and relationship building.', 2, 1, '558c5553-df23-4e46-9168-2273d252ee86'),
('David', 'Rodriguez', 'david.rodriguez@email.com', 'Ambitious BDR with 2 years in SaaS sales. Strong track record of qualifying 50+ leads monthly and booking 15+ demos per week. Skilled in social selling, prospecting, and CRM management with HubSpot.', 2, 1, '558c5553-df23-4e46-9168-2273d252ee86');

-- Product Marketing Manager (application_id: 3)
INSERT INTO applicants ("first name", "last name", email, "CV", application_id, status, role_id) VALUES
('Jessica', 'Taylor', 'jessica.taylor@email.com', 'Strategic product marketer with 5+ years launching B2B SaaS products. Led go-to-market strategies that drove $10M+ ARR growth. Expert in positioning, messaging, competitive analysis, and sales enablement content creation.', 3, 1, '558c5553-df23-4e46-9168-2273d252ee86'),
('Alex', 'Thompson', 'alex.thompson@email.com', 'Data-driven PMM with 4 years experience in tech startups. Specialized in customer research, product launches, and growth marketing. Successfully launched 8+ products with average 40% adoption rates.', 3, 3, '558c5553-df23-4e46-9168-2273d252ee86');

-- Head of Talent (application_id: 4)
INSERT INTO applicants ("first name", "last name", email, "CV", application_id, status, role_id) VALUES
('Rachel', 'Anderson', 'rachel.anderson@email.com', 'Senior talent leader with 8+ years scaling teams at high-growth startups. Built recruiting operations from 0 to 200+ hires annually. Expert in employer branding, diversity initiatives, and ATS optimization with proven ROI.', 4, 2, '558c5553-df23-4e46-9168-2273d252ee86'),
('Marcus', 'Brown', 'marcus.brown@email.com', 'Experienced Head of Talent with decade-long track record in tech recruiting. Led talent acquisition for 3 successful IPOs. Specialized in executive search, team scaling, and building world-class recruiting processes.', 4, 1, '558c5553-df23-4e46-9168-2273d252ee86');

-- Junior Software Developer (application_id: 5)
INSERT INTO applicants ("first name", "last name", email, "CV", application_id, status, role_id) VALUES
('Olivia', 'Davis', 'olivia.davis@email.com', 'Recent computer science graduate with strong foundation in JavaScript, React, and Python. Completed 3 internships and built 5+ personal projects including a full-stack e-commerce app. Eager to learn and contribute to a collaborative team.', 5, 1, '558c5553-df23-4e46-9168-2273d252ee86'),
('James', 'Wilson', 'james.wilson@email.com', 'Bootcamp graduate with 1 year experience as junior developer. Proficient in modern web technologies and version control. Built several React applications and contributed to open-source projects. Strong problem-solving skills and growth mindset.', 5, 1, '558c5553-df23-4e46-9168-2273d252ee86');