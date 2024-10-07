-- Modify the clients table
ALTER TABLE public.clients
DROP COLUMN IF EXISTS age,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Update the policies if necessary
CREATE POLICY "Users can update their own address" ON public.clients
FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- Grant necessary permissions
GRANT UPDATE(address) ON public.clients TO authenticated;