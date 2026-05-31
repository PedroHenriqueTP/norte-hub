-- 1. Create a new user in auth.users (Access this via Authentication > Users in Supabase Dashboard normally, but if you want to do it via SQL)
-- NOTE: It's easier to Sign Up via the actual App (/app/login) first, then run the update below.

-- 2. Assuming you have already signed up with an email (e.g., 'admin@autoshop.com'), 
-- run this to make that user a Super Admin.

-- Replace 'admin@autoshop.com' with your actual email
update profiles
set is_super_admin = true
where email = 'admin@autoshop.com';

-- 3. Verify the update
select * from profiles where is_super_admin = true;

-- 4. (Optional) Create a dummy organization for the admin if needed
-- insert into organizations (name, slug, owner_id)
-- values ('AutoShop Admin Org', 'admin-org', (select id from profiles where email = 'admin@autoshop.com'));
