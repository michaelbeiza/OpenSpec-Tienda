## admin-seed-data

SQL seed data for development and demo purposes.

### Requirements

1. The migration file SHALL insert 5 products: Laptop, Mouse Inalámbrico, Teclado Mecánico, Monitor 4K, Auriculares Pro.
2. The migration SHALL insert 3 user profiles: 1 admin (`admin@tienda.com`), 2 standard users.
3. The migration SHALL insert 2 example orders, each with 2–3 order items referencing the seed products.
4. The seed file SHALL use `ON CONFLICT DO NOTHING` to be safely re-runnable.
5. The seed file SHALL NOT hard-code Supabase auth UIDs (auth users must be created by hand or via Supabase dashboard).

### Scenarios

- WHEN the seed SQL is executed in Supabase SQL Editor, THEN 5 products appear in the products table.
- WHEN the seed SQL is re-executed, THEN no duplicate records are created.
