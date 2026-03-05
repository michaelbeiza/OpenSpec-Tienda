## Why

The existing admin functionality in `tienda-online` is embedded in a single page and lacks the depth required for day-to-day administrative operations. This change introduces a complete, standalone admin panel with a proper layout, navigation, and full CRUD capabilities for both products and users, including purchase history and role management. A dedicated authentication flow with Google OAuth will also be added.

## What Changes

- **New auth flow**: A dedicated `/login` page supporting email/password and Google OAuth. Auth redirects users to `/admin` or `/shop` based on role.
- **Admin dashboard** (`/admin/dashboard`): Top-level admin entry point with stats overview and sidebar navigation.
- **Product management** (`/admin/productos`): Full CRUD table for products with real-time inventory display.
- **User management** (`/admin/usuarios`): Table of all users with role management, purchase history modal, and restricted delete (admin cannot delete themselves).
- **Seed data**: SQL script with 5 products, 3 users (1 admin, 2 standard), and 2 example orders with items.
- **Styling**: Tailwind CSS replaces existing CSS variables for all new admin components.

## Capabilities

### New Capabilities
- `admin-auth`: Dedicated login/register page with Google OAuth and role-based redirect.
- `admin-dashboard`: Protected admin layout with sidebar navigation and stats.
- `admin-products`: Complete product management UI (list, add, edit, delete) with real-time inventory.
- `admin-users`: User management with role change, order history modal, and self-delete protection.
- `admin-seed-data`: SQL seed data for development (5 products, 3 users, 2 orders).

### Modified Capabilities

## Impact

- New Astro pages and React components under `/admin/`.
- Tailwind CSS added as a new dependency.
- Supabase RLS policies extended to cover user listing and role modification endpoints.
- Existing `src/lib/supabase.ts` and `src/context/AuthContext.tsx` reused and extended.
