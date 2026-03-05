## Context

The `tienda-online` project has a basic in-page admin section. This change expands that to a complete, standalone admin panel with dedicated pages, sidebar layout, Google OAuth, and Tailwind CSS styling. The existing Supabase client and AuthContext will be reused.

## Goals / Non-Goals

**Goals:**
- Deliver a fully navigable admin section at `/admin/` with sidebar layout.
- Implement Google OAuth in addition to email/password login via Supabase Auth.
- Provide complete CRUD for products and users within the admin panel.
- Display order history inside a modal per user.
- Add a SQL seed file with realistic test data.
- Protect all admin routes at the UI level (role check in components).

**Non-Goals:**
- A customer-facing shop redesign (out of scope for this change).
- Payment gateway integration (already exists).
- Server-Side Rendering of admin pages (client-only React components keep it simple).

## Decisions

- **Tailwind CSS**: Added via `@astrojs/tailwind`. Provides utility classes for the admin UI without writing custom CSS files.
  - *Rationale:* Faster iteration on admin UI; isolated from existing CSS variables used in shop pages.
- **Google OAuth**: Configured via Supabase Auth Provider settings. The frontend just calls `supabase.auth.signInWithOAuth({ provider: 'google' })`.
  - *Rationale:* Zero backend code needed; Supabase handles the OAuth callback.
- **Role-Based Redirect**: After login, `AuthContext` checks `profile.role` and redirects accordingly (`/admin/dashboard` or `/shop`).
  - *Rationale:* Single redirect logic, consistent with existing `AuthContext` pattern.
- **Admin self-delete protection**: Enforced both in the UI (button hidden/disabled for own record) and in a Supabase RLS policy that prevents a user from deleting their own profile.
  - *Rationale:* Defense in depth; UI guard is UX, DB policy is the real security layer.
- **Seed data as a separate SQL file**: `supabase/migrations/002_seed_data.sql` keeps seed data separate from schema migrations.

## Risks / Trade-offs

- **Risk: Google OAuth requires Supabase dashboard configuration.** → Mitigation: Document the required steps clearly in the migration file comments.
- **Risk: Tailwind + existing global CSS could conflict.** → Mitigation: Scope Tailwind to admin pages only by using it in admin-specific Astro layouts, not the global `Layout.astro`.
- **Risk: User listing requires service-role key or admin-specific RLS bypass.** → Mitigation: Create a Supabase RLS policy that allows admin-role users to SELECT all profiles.
