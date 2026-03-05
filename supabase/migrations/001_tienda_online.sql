-- =============================================================
-- Tienda Online - Supabase Migration Script
-- Run this in the Supabase SQL Editor
-- =============================================================

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  inventory INT NOT NULL DEFAULT 0 CHECK (inventory >= 0),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =============================================================
-- Row Level Security (RLS) Policies
-- =============================================================

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews       ENABLE ROW LEVEL SECURITY;

-- Helper: check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles
CREATE POLICY "Users can read their own profile"  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles"      ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update their profile"    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Products: anyone can read, only admins can write
CREATE POLICY "Anyone can view products"          ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products"        ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update products"        ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete products"        ON public.products FOR DELETE USING (public.is_admin());

-- Orders: users see their own, admins see all
CREATE POLICY "Users see own orders"              ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create orders"           ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders"          ON public.orders FOR UPDATE USING (public.is_admin());

-- Order items: accessible if you can see the order
CREATE POLICY "Users see own order items"         ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Users can insert order items"      ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Reviews: anyone reads, authenticated users write their own
CREATE POLICY "Anyone can read reviews"           ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert"    ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review"       ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review"       ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- =============================================================
-- Sample Data (optional: comment out if not needed)
-- =============================================================

INSERT INTO public.products (name, description, price, inventory) VALUES
  ('Zapatillas Premium', 'Zapatillas de alta calidad para deporte y uso diario.', 89.99, 50),
  ('Camiseta Básica', 'Camiseta de algodón 100% disponible en varios colores.', 19.99, 200),
  ('Mochila Urbana', 'Mochila resistente con compartimentos para portátil.', 49.99, 75),
  ('Auriculares Inalámbricos', 'Sonido cristalino con cancelación de ruido.', 129.99, 30),
  ('Reloj Inteligente', 'Monitoriza tu salud y mantente conectado.', 199.99, 20),
  ('Gafas de Sol', 'Protección UV400 con diseño moderno.', 34.99, 100)
ON CONFLICT DO NOTHING;
