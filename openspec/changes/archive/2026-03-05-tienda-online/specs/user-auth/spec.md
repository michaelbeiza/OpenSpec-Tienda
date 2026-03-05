## ADDED Requirements

### Requirement: User Registration and Authentication
The system MUST allow users to register for a new account and log in securely. Authentication MUST be handled via Supabase Auth using JWT tokens.

#### Scenario: Successful user registration
- **WHEN** a visitor provides a valid email and password
- **THEN** the system creates a new user account and returns an authentication token

#### Scenario: Successful user login
- **WHEN** a registered user provides correct credentials
- **THEN** the system authenticates the user and provides a JWT token for subsequent requests

### Requirement: Role-Based Access Control
The system MUST distinguish between regular users and administrators. Administrators have elevated privileges for managing the system.

#### Scenario: Admin access granted
- **WHEN** an authenticated user with the 'admin' role attempts to access an admin-only route or action
- **THEN** the system permits the action

#### Scenario: Admin access denied for regular users
- **WHEN** an authenticated user without the 'admin' role attempts to access an admin-only route
- **THEN** the system denies the action and returns an unauthorized error
