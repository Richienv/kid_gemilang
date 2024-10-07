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

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.orders TO authenticated;