-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflicts (optional, but safer)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a policy that allows users to view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Verify that the policy works (optional check)
-- You should now be able to see the Admin Panel if is_super_admin is true.
