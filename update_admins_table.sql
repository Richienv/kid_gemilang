-- Modify the admins table
ALTER TABLE public.admins
DROP COLUMN IF EXISTS user_id,
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS password TEXT NOT NULL;

-- Insert a sample admin (replace with your actual admin credentials)
INSERT INTO public.admins (email, password)
VALUES ('admin@example.com', 'hashed_password_here');

-- Update the policy
DROP POLICY IF EXISTS "Allow read access to admins table" ON public.admins;

CREATE POLICY "Allow read access to admins table"
ON public.admins FOR SELECT
TO authenticated
USING (true);

-- Ensure RLS is enabled
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT ON public.admins TO authenticated;