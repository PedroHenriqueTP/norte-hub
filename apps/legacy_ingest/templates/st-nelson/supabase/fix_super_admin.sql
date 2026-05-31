-- Update a specific user to be a Super Admin based on their email
-- Replace 'admin@loja.com' with the actual email you used to register
UPDATE public.profiles
SET is_super_admin = true
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.email = 'admin@loja.com';

-- Verify the change
SELECT * FROM public.profiles WHERE is_super_admin = true;
