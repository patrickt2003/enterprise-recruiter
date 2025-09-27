-- Add a unique role_uuid column to Open Roles
ALTER TABLE "Open Roles" ADD COLUMN role_uuid uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "Open Roles" ADD CONSTRAINT open_roles_role_uuid_unique UNIQUE (role_uuid);

-- Add foreign key constraint
ALTER TABLE applicants 
ADD CONSTRAINT applicants_role_id_fkey 
FOREIGN KEY (role_id) REFERENCES "Open Roles"(role_uuid) 
ON DELETE CASCADE;