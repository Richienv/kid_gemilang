-- Update orders table to include a reference to clients
ALTER TABLE public.orders
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Update existing orders to link to clients (if necessary)
-- You may need to adjust this based on your actual data
UPDATE public.orders
SET client_id = (SELECT id FROM public.clients WHERE clients.user_id = orders.user_id)
WHERE client_id IS NULL;

-- Add an index to improve query performance
CREATE INDEX idx_orders_client_id ON public.orders(client_id);

-- Update the RLS policy for orders to use client_id
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM public.clients WHERE id = client_id));

-- Ensure admins can view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (auth.uid() IN (SELECT user_id FROM public.admins));