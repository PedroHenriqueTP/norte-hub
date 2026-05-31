-- 1. Sign up a user with email 'seller@autoshop.com' (or change the email below)
-- 2. Run this script in Supabase SQL Editor

WITH new_org AS (
  INSERT INTO organizations (name, slug, owner_id)
  VALUES (
    'AutoShop Demo Store',
    'loja-demo',
    (SELECT id FROM profiles WHERE email = 'seller@autoshop.com') -- Replace with your seller email
  )
  RETURNING id
)
INSERT INTO vehicles (organization_id, brand, model, version, year_manufacture, year_model, price_sell, mileage, fuel_type, transmission, color, status, photos)
SELECT 
  id,
  'Toyota', 'Corolla', 'XEi 2.0 Flex', 2023, 2024, 145000.00, 15000, 'Flex', 'Automático', 'Branco', 'disponivel', ARRAY['']::text[]
FROM new_org
UNION ALL
SELECT 
  id,
  'Honda', 'Civic', 'Touring 1.5 Turbo', 2022, 2022, 168000.00, 22000, 'Gasolina', 'Automático', 'Cinza', 'disponivel', ARRAY['']::text[]
FROM new_org
UNION ALL
SELECT 
  id,
  'Jeep', 'Compass', 'Longitude T270', 2023, 2023, 175900.00, 12000, 'Flex', 'Automático', 'Preto', 'disponivel', ARRAY['']::text[]
FROM new_org;

-- Add Site Config
INSERT INTO site_config (organization_id, welcome_message, primary_color)
SELECT id, 'Bem-vindo à Loja Demo!', '#dc2626'
FROM organizations WHERE slug = 'loja-demo';
