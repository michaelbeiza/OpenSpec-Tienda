-- =============================================================
-- Migration 002: Extended Admin RLS Policies
-- Run this AFTER 001_tienda_online.sql
-- =============================================================

-- Allow admins to SELECT all profiles (needed for Users admin page)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON public.profiles FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- Allow admins to UPDATE any user's role
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can update any profile'
  ) THEN
    CREATE POLICY "Admins can update any profile"
      ON public.profiles FOR UPDATE
      USING (public.is_admin());
  END IF;
END $$;

-- Allow admins to DELETE other profiles (but NOT their own — enforced here at DB level)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can delete other profiles'
  ) THEN
    CREATE POLICY "Admins can delete other profiles"
      ON public.profiles FOR DELETE
      USING (public.is_admin() AND id <> auth.uid());
  END IF;
END $$;
