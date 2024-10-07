-- Drop all existing policies on the admins table
DROP POLICY IF EXISTS "Authenticated users can view admin records" ON public.admins;
DROP POLICY IF EXISTS "Prevent modifications to admin records" ON public.admins;
DROP POLICY IF EXISTS "Superusers can insert admin records" ON public.admins;

-- Create a simple policy that allows all authenticated users to read from the admins table
CREATE POLICY "Allow read access to admins table"
ON public.admins FOR SELECT
TO authenticated
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON public.admins TO authenticated;