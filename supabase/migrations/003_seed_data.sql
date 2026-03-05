-- =============================================================
-- Migration 003: Seed Data
-- 5 products, example orders (users must be created via Supabase Auth first)
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- =============================================================

-- 5 Sample products
INSERT INTO public.products (name, description, price, inventory, image_url) VALUES
  (
    'Laptop Pro 15"',
    'Portátil de alto rendimiento con procesador Intel Core i7, 16GB RAM y 512GB SSD. Ideal para trabajo y desarrollo.',
    1299.99, 15,
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
  ),
  (
    'Mouse Inalámbrico',
    'Ratón ergonómico con conexión Bluetooth y receptor USB. Batería de larga duración, hasta 18 meses.',
    29.99, 150,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
  ),
  (
    'Teclado Mecánico RGB',
    'Teclado mecánico TKL con switches Cherry MX Red e iluminación RGB por tecla. Conexión USB-C.',
    89.99, 45,
    'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400'
  ),
  (
    'Monitor 4K Ultra HD',
    'Monitor IPS de 27 pulgadas con resolución 4K, 144Hz y tiempo de respuesta de 1ms. Compatible con HDR600.',
    449.99, 20,
    'https://images.unsplash.com/photo-1527443224154-c4a573d5ceba?w=400'
  ),
  (
    'Auriculares Pro Noise Cancelling',
    'Auriculares over-ear con cancelación activa de ruido, 30 horas de batería y calidad de sonido Hi-Fi.',
    199.99, 60,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'
  )
ON CONFLICT DO NOTHING;

-- Note about users:
-- Users (profiles) are created automatically when someone registers via Supabase Auth.
-- To promote a user to admin, run:
--   UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@tudominio.com';
--
-- Example orders below use placeholder UUIDs — replace with real user IDs from your profiles table.
-- To get user IDs: SELECT id, email FROM public.profiles;
--
-- UNCOMMENT and fill in real UUIDs to add example orders:
/*
INSERT INTO public.orders (id, user_id, status, total, shipping_address) VALUES
  (
    gen_random_uuid(),
    '<replace-with-real-user-uuid>',
    'paid',
    1329.98,
    '{"name":"Juan García","address":"Calle Mayor 1","city":"Madrid","postal_code":"28001","country":"España"}'::jsonb
  ),
  (
    gen_random_uuid(),
    '<replace-with-real-user-uuid>',
    'shipped',
    89.99,
    '{"name":"María López","address":"Av. Diagonal 100","city":"Barcelona","postal_code":"08019","country":"España"}'::jsonb
  )
ON CONFLICT DO NOTHING;
*/
