-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  is_super_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORGANIZATIONS (Tenants)
create table organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  owner_id uuid references profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SITE CONFIG (CMS)
create table site_config (
  organization_id uuid references organizations(id) primary key,
  banner_url text,
  welcome_message text,
  primary_color text default '#dc2626',
  about_us_text text,
  whatsapp_number text,
  show_blog boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- VEHICLES
create type vehicle_status as enum ('disponivel', 'reservado', 'vendido', 'manutencao');

create table vehicles (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id) not null,
  brand text not null,
  model text not null,
  version text,
  year_manufacture integer not null,
  year_model integer not null,
  price_sell numeric not null,
  mileage integer not null,
  fuel_type text not null,
  transmission text not null,
  color text not null,
  status vehicle_status default 'disponivel',
  description text,
  photos text[] default array[]::text[],
  
  -- Admin Only Fields
  price_buy numeric,
  repair_costs numeric default 0,
  date_buy date,
  date_sell date,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- FINANCIAL TRANSACTIONS
create table financial_transactions (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id) not null,
  type text not null check (type in ('income', 'expense')),
  category text not null, -- 'sale', 'purchase', 'maintenance', 'marketing', 'rent', 'salary', 'other'
  amount numeric not null,
  date date not null,
  description text,
  vehicle_id uuid references vehicles(id), -- Optional relation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BLOG POSTS
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references organizations(id) not null,
  title text not null,
  slug text not null,
  content text not null,
  image_url text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES --

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table site_config enable row level security;
alter table vehicles enable row level security;
alter table financial_transactions enable row level security;
alter table blog_posts enable row level security;

-- PROFILES POLICIES
create policy "Public profiles are viewable by everyone" 
  on profiles for select using (true);

create policy "Users can insert their own profile" 
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update using (auth.uid() = id);

-- ORGANIZATIONS POLICIES
create policy "Super Admin sees all organizations"
  on organizations for select
  using (exists (select 1 from profiles where id = auth.uid() and is_super_admin = true));

create policy "Tenants see own organization"
  on organizations for select
  using (owner_id = auth.uid());

create policy "Tenants can update own organization"
  on organizations for update
  using (owner_id = auth.uid());

create policy "Users can populate their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can create their own organization"
  on organizations for insert
  with check (owner_id = auth.uid());

-- SITE CONFIG POLICIES
create policy "Public read site config"
  on site_config for select using (true);
  
create policy "Super Admin read all site config"
  on site_config for select
  using (exists (select 1 from profiles where id = auth.uid() and is_super_admin = true));

create policy "Tenants manage own site config"
  on site_config for all
  using (organization_id in (select id from organizations where owner_id = auth.uid()));

-- VEHICLES POLICIES
create policy "Public read available vehicles"
  on vehicles for select
  using (status = 'disponivel');

create policy "Super Admin sees all vehicles"
  on vehicles for select
  using (exists (select 1 from profiles where id = auth.uid() and is_super_admin = true));

create policy "Tenants see all their vehicles"
  on vehicles for select
  using (organization_id in (select id from organizations where owner_id = auth.uid()));

create policy "Tenants manage their vehicles"
  on vehicles for all
  using (organization_id in (select id from organizations where owner_id = auth.uid()));

-- FINANCIAL TRANSACTIONS POLICIES
create policy "Super Admin sees all transactions"
  on financial_transactions for select
  using (exists (select 1 from profiles where id = auth.uid() and is_super_admin = true));

create policy "Tenants manage their transactions"
  on financial_transactions for all
  using (organization_id in (select id from organizations where owner_id = auth.uid()));

-- BLOG POSTS POLICIES
create policy "Public read published posts"
  on blog_posts for select
  using (published = true);

create policy "Tenants manage their posts"
  on blog_posts for all
  using (organization_id in (select id from organizations where owner_id = auth.uid()));
