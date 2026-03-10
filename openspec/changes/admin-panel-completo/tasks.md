## 1. Setup

- [/] 1.1 Install Tailwind CSS integration for Astro (`@astrojs/tailwind`)
- [ ] 1.2 Configure `astro.config.mjs` to add Tailwind integration scoped to admin pages
- [ ] 1.3 Update `src/lib/supabase.ts` if needed (no change expected, already uses `PUBLIC_` env vars)

## 2. Authentication

- [ ] 2.1 Create `src/pages/login.astro` — replaces the existing `/login/index.astro`
- [ ] 2.2 Create `src/components/Auth.tsx` — React component with email/password + Google OAuth tabs
- [ ] 2.3 Update `src/context/AuthContext.tsx` to add Google OAuth sign-in function and role-based redirect
- [ ] 2.4 Create `src/lib/auth.ts` — helper functions (`signInWithGoogle`, `redirectByRole`)

## 3. Admin Layout & Dashboard

- [ ] 3.1 Create `src/layouts/AdminLayout.astro` — admin-specific layout with Tailwind sidebar
- [ ] 3.2 Create `src/pages/admin/dashboard.astro` — admin landing page
- [ ] 3.3 Create `src/components/admin/AdminSidebar.tsx` — sidebar navigation component
- [ ] 3.4 Create `src/components/admin/StatsCard.tsx` — reusable stats card component
- [ ] 3.5 Create `src/components/admin/DashboardPage.tsx` — dashboard React component with stats

## 4. Product Management

- [ ] 4.1 Create `src/pages/admin/productos.astro` — routes to React product management page
- [ ] 4.2 Create `src/components/admin/ProductsTable.tsx` — products data table (list, sort)
- [ ] 4.3 Create `src/components/admin/ProductForm.tsx` — add/edit product modal form with validation
- [ ] 4.4 Implement delete confirmation dialog in `ProductsTable`

## 5. User Management

- [ ] 5.1 Create `src/pages/admin/usuarios.astro` — routes to React user management page
- [ ] 5.2 Create `src/components/admin/UsersTable.tsx` — users data table with search by email
- [ ] 5.3 Create `src/components/admin/UserOrdersModal.tsx` — modal showing a user's orders + items
- [ ] 5.4 Implement role change (dropdown) in `UsersTable`
- [ ] 5.5 Implement delete with self-delete guard in `UsersTable`

## 6. Database & Security

- [ ] 6.1 Add RLS policy: admins can SELECT all profiles
- [ ] 6.2 Add RLS policy: admins can UPDATE any profile's role
- [ ] 6.3 Add RLS policy: admins can DELETE any profile except their own
- [ ] 6.4 Create `supabase/migrations/002_admin_rls.sql` with the new policies
- [ ] 6.5 Create `supabase/migrations/003_seed_data.sql` with 5 products, 3 users, 2 orders

## 7. Verification

- [ ] 7.1 Run `npm run build` — should complete with no errors
- [ ] 7.2 Test login with email/password and Google OAuth
- [ ] 7.3 Test admin dashboard access control (non-admin redirect)
- [ ] 7.4 Test full product CRUD cycle
- [ ] 7.5 Test user listing, search, role change, order modal
## 8. Category Pages & Routing

- [ ] 8.1 Add `category` column to `products` table in Supabase (Migration)
- [ ] 8.2 Update `Product` interface in `src/lib/types.ts` to include `category`
- [ ] 8.3 Create `src/pages/categories/[category].astro` for dynamic category routing
- [ ] 8.4 Create `src/components/pages/CategoryPage.tsx` React component
- [ ] 8.5 Update `src/components/Navbar.tsx` to use the new route format `/categories/:name`
- [ ] 8.6 Update `src/components/admin/ProductForm.tsx` to include Category selection
