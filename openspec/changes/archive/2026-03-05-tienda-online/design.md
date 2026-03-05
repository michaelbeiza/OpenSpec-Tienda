## Context
This project aims to create "tienda-online", a comprehensive e-commerce platform built over Supabase. The platform needs to support standard shopping features (browsing, cart, checkout) and administrative functions (inventory management, pricing). Security and data integrity are paramount, using JWT for authentication and Supabase's built-in protections. The architecture will involve a frontend (likely React/Next.js based on the environment) communicating with a Supabase backend.

## Goals / Non-Goals

**Goals:**
- Provide a responsive and intuitive user interface for browsing and purchasing products.
- Implement secure JWT-based authentication with distinct User and Admin roles.
- Enable full product lifecycle management for administrators.
- Ensure robust interactions with the Supabase database, preventing SQL injection and unauthorized access.
- Deliver a functional shopping cart and seamless checkout experience.

**Non-Goals:**
- Integration with external ERP or complex inventory management systems (beyond basic tracking).
- Advanced analytics or machine learning recommendations (basic purchase history is sufficient).
- Multi-vendor support (this is a single-vendor store).

## Decisions

- **Backend / Database:** Supabase (Client-Side Connection).
  - *Rationale:* We will connect directly from the React frontend to Supabase using user-provided API keys. This serverless approach relies on Supabase for out-of-the-box PostgreSQL, authentication, and auto-generated APIs, accelerating development while ensuring security via RLS.
- **Authentication:** Supabase Auth (JWT).
  - *Rationale:* Integrates perfectly with Supabase's Row Level Security (RLS) to restrict data access based on user roles (admin vs. user).
- **Data Modeling:** We will need tables for `users` (extending Supabase auth), `products`, `orders`, `order_items`, and `reviews`. The shopping cart will likely be managed primarily in frontend state (or a generic `carts` table if cross-device persistence is required).
- **Security:** We will leverage Supabase Row Level Security (RLS) heavily.
    - *Rationale:* This ensures that even if API endpoints are exposed, users can only read/write data they are authorized to access (e.g., users can only see their own orders; admins can manage all products).

## Risks / Trade-offs

- **Risk: Complex state management for the shopping cart.** $\rightarrow$ Mitigation: Use a robust state management solution (e.g., React Context or Zustand) and carefully synchronize it with local storage or the database.
- **Risk: Ensuring strict separation of Admin and User privileges.** $\rightarrow$ Mitigation: Rely on Supabase RLS policies as the primary enforcement mechanism, rather than just frontend routing checks.
- **Risk: Handling payment processing securely.** $\rightarrow$ Mitigation: Integrate a trusted third-party payment gateway (like Stripe) rather than handling raw credit card data, using secure webhook endpoints to update order status.
