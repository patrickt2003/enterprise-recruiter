-- Enable RLS policies for Open Roles table
-- Allow authenticated users to insert their own roles
CREATE POLICY "Users can insert their own roles" 
ON public."Open Roles" 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view all roles (public job postings)
CREATE POLICY "Anyone can view open roles" 
ON public."Open Roles" 
FOR SELECT 
TO authenticated
USING (true);

-- Allow users to update their own roles
CREATE POLICY "Users can update their own roles" 
ON public."Open Roles" 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Allow users to delete their own roles
CREATE POLICY "Users can delete their own roles" 
ON public."Open Roles" 
FOR DELETE 
TO authenticated
USING (auth.uid() = id);