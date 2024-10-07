-- Add client_id column to orders table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'client_id') THEN
        ALTER TABLE public.orders ADD COLUMN client_id UUID REFERENCES public.clients(id);
    END IF;
END $$;

-- Update existing rows to link to clients (if necessary)
UPDATE public.orders
SET client_id = (SELECT id FROM public.clients WHERE clients.id = orders.user_id)
WHERE client_id IS NULL;

-- Add an index to improve query performance
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON public.orders(client_id);

-- Update the RLS policy for orders to use client_id
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid()::uuid = client_id);

-- Ensure admins can view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (auth.email()::text IN (SELECT email FROM public.admins));

-- Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() = client_id);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.orders TO authenticated;