-- Create the clients table
CREATE TABLE public.clients (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    company_name TEXT,
    age INTEGER,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_modtime
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Policies

-- Allow users to insert their own data
CREATE POLICY insert_own_client ON public.clients
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to select their own data
CREATE POLICY select_own_client ON public.clients
FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY update_own_client ON public.clients
FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own data (optional, uncomment if needed)
-- CREATE POLICY delete_own_client ON public.clients
-- FOR DELETE USING (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.clients TO authenticated;

-- Grant usage on the clients id sequence to authenticated users
GRANT USAGE ON SEQUENCE public.clients_id_seq TO authenticated;