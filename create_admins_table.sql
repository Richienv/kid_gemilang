-- Create the new admins table
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows all authenticated users to read from the admins table
CREATE POLICY "Allow read access to admins table"
ON public.admins FOR SELECT
TO authenticated
USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.admins TO authenticated;

-- Insert a sample admin (replace with your actual admin email)
INSERT INTO public.admins (email)
VALUES ('admin@example.com');