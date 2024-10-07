-- Drop all existing policies on the admins table
DROP POLICY IF EXISTS "Allow all access to admins table" ON public.admins;

-- Create a simple policy that allows all authenticated users to read from the admins table
CREATE POLICY "Allow read access to admins table"
ON public.admins FOR SELECT
TO authenticated
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON public.admins TO authenticated;