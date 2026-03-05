## ADDED Requirements

### Requirement: Secure Database Interactions
The system MUST utilize Supabase as the primary data store, connecting directly from the React frontend using user-provided API keys. Security MUST be enforced at the database layer using Row Level Security (RLS), and all data access MUST be parameterized via the Supabase client library to prevent SQL injection vulnerabilities.

#### Scenario: RLS prevents unauthorized data access
- **WHEN** a malicious user attempts to query orders belonging to a different user ID
- **THEN** the Supabase RLS policies reject the query and return no data or an error

#### Scenario: Prevention of SQL Injection
- **WHEN** a user inputs malicious SQL syntax into a search or filter field
- **THEN** the Supabase client safely parameterizes the input, treating it strictly as a string literal, preventing execution of the payload
