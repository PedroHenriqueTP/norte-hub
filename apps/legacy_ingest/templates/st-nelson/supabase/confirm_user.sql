-- Force confirm the user email (Run this in Supabase SQL Editor)
-- This fixes the "Email not confirmed" error for users created BEFORE you disabled the setting.

UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'admin@autoshop.com'; -- Change this if you used another email

-- Verify
SELECT email, email_confirmed_at FROM auth.users WHERE email = 'admin@autoshop.com';
