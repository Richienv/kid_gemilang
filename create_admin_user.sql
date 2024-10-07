-- Check if the admin user already exists
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to get the existing user id
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'kdwb.co@gmail.com';
  
  -- If the user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
    VALUES (
      'kdwb.co@gmail.com',
      crypt('123456', gen_salt('bf')),
      now(),
      'authenticated'
    )
    RETURNING id INTO admin_user_id;
  END IF;
  
  -- Update the public.admins table with the user_id
  UPDATE public.admins
  SET id = admin_user_id
  WHERE email = 'kdwb.co@gmail.com';
  
  -- If no row was updated in public.admins, insert a new row
  IF NOT FOUND THEN
    INSERT INTO public.admins (id, email)
    VALUES (admin_user_id, 'kdwb.co@gmail.com');
  END IF;
END $$;