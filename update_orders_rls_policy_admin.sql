-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM public.admins
  )
);

-- Grant necessary permissions
GRANT SELECT ON public.orders TO authenticated;