-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.email = auth.email()
  )
);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.orders TO authenticated;