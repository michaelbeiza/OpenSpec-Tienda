## Why

We need to build a comprehensive online store (tienda-online) to allow users to browse and purchase products, and for administrators to manage the inventory and sales. This will provide a complete e-commerce platform with secure authentication, cart management, checkout, and order history, built on top of Supabase.

## What Changes

This is a new implementation introducing the following capabilities:
- Product browsing, filtering, and detailed views for users.
- Shopping cart functionality (add, update, remove items).
- Checkout process, including payment processing and shipping address management.
- User authentication via JWT with roles for regular users and administrators.
- Order history tracking for users.
- Product reviews by users.
- Administrator capabilities to manage products (change prices, delete, view purchase history).
- Secure database integration connecting directly from React to Supabase, utilizing user-provided API keys and protections against SQL injection.

## Capabilities

### New Capabilities
- `user-auth`: User authentication (register, login, logout), JWT, and role management (admin vs standard user).
- `product-management`: Product listing, details, filtering, inventory management, and admin controls (pricing, deletion, viewing purchase stats).
- `shopping-cart`: Management of the user's shopping cart (add, update, remove items).
- `checkout-and-orders`: Checkout flow, shipping addresses, order processing, and user order history.
- `payment-system`: Processing of payments during checkout.
- `product-reviews`: Users' ability to leave opinions/reviews on products they view/purchase.
- `database-integration`: Integration with Supabase for secure data storage.

### Modified Capabilities

## Impact

This is a greenfield project or a major new feature set. It will introduce new frontend pages, internal states for the shopping cart and checkout, and a new backend integration layer interacting with Supabase for authentication, database queries, and security.
