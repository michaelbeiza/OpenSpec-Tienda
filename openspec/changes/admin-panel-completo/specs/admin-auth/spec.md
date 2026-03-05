## admin-auth

Dedicated authentication page supporting email/password and Google OAuth, with role-based redirect after login.

### Requirements

1. The system SHALL present a single `/login` page with tabs or toggle for Sign In / Sign Up (email+password).
2. The page SHALL include a "Sign in with Google" button that initiates Supabase Google OAuth.
3. On successful authentication, the system SHALL redirect the user to `/admin/dashboard` if their role is `admin`, or to `/` otherwise.
4. The page SHALL display clear error messages for invalid credentials.
5. The system SHALL support logout from any admin page, clearing the Supabase session.

### Scenarios

- WHEN a user visits `/login` and is already authenticated as admin, THEN redirect immediately to `/admin/dashboard`.
- WHEN a user submits valid email/password, THEN sign them in and redirect based on role.
- WHEN a user clicks "Sign in with Google", THEN initiate Supabase OAuth flow.
- WHEN authentication fails, THEN display an error message without redirecting.
- WHEN a user logs out, THEN clear the session and redirect to `/login`.
