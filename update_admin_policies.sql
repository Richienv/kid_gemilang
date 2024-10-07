-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read admins" ON public.admins;

-- Allow all authenticated users to read from the admins table
CREATE POLICY "Allow authenticated users to read admins"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Ensure RLS is enabled on the admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON public.admins TO authenticated;