## admin-dashboard

Protected admin entry point with sidebar navigation and summary statistics.

### Requirements

1. The system SHALL render `/admin/dashboard` only for authenticated users with role `admin`.
2. Unauthenticated or non-admin users SHALL be redirected to `/login`.
3. The dashboard SHALL display a persistent sidebar with links to: Dashboard, Productos, Usuarios.
4. The dashboard SHALL show summary cards with: total products, total users, total orders, total revenue.
5. The layout SHALL be responsive down to tablet width (768px).

### Scenarios

- WHEN an admin visits `/admin/dashboard`, THEN the sidebar and stats are shown.
- WHEN a non-admin user visits `/admin/dashboard`, THEN they are redirected to `/login`.
- WHEN an unauthenticated user visits `/admin/dashboard`, THEN they are redirected to `/login`.
