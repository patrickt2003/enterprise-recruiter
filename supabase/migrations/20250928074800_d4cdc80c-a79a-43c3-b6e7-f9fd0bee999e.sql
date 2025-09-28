-- Update the RLS policy to only allow users to view their own roles
DROP POLICY IF EXISTS "Anyone can view open roles" ON "Open Roles";

CREATE POLICY "Users can view their own roles" 
ON "Open Roles" 
FOR SELECT 
USING (auth.uid() = id);