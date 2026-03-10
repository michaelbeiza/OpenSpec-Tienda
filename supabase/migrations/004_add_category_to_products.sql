-- =============================================================
-- Migration 004: Add category column to products
-- =============================================================

-- Add category column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='products' AND column_name='category'
  ) THEN
    ALTER TABLE public.products ADD COLUMN category TEXT NOT NULL DEFAULT 'Otros';
  END IF;
END $$;
