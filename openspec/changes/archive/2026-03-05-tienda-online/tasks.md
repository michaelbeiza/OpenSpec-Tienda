## 1. Project Setup and Infrastructure

- [x] 1.1 Initialize Astro + React project structure (if not already done)
- [x] 1.2 Set up Supabase client in the project
- [x] 1.3 Configure environment variables for Supabase (URL, Anon Key)
- [x] 1.4 Setup routing structure for main pages (Home, Products, Cart, Checkout, Login, Admin)

## 2. Database and Security (Supabase)

- [x] 2.1 Create `users` table/logic extending Supabase Auth (roles: admin/user)
- [x] 2.2 Create `products` table (id, name, description, price, inventory, image_url)
- [x] 2.3 Create `orders` and `order_items` tables
- [x] 2.4 Create `reviews` table
- [x] 2.5 Implement Row Level Security (RLS) policies for all tables (Admins: all access, Users: read products, read/write own orders/reviews)

## 3. User Authentication

- [x] 3.1 Build Login and Registration UI components
- [x] 3.2 Implement Supabase Auth integration for sign in/up/out
- [x] 3.3 Create a protected route higher-order component or middleware to restrict pages based on auth state and role

## 4. Product Management (Admin & User)

- [x] 4.1 Build Admin interface to add, edit (price), and delete products
- [x] 4.2 Build public Product Listing page with filtering capabilities
- [x] 4.3 Build public Product Details page

## 5. Shopping Cart

- [x] 5.1 Implement global state management for the Cart (Zustand or React Context)
- [x] 5.2 Build "Add to Cart" functionality on product pages
- [x] 5.3 Build the Cart UI (drawer or dedicated page) to view, update quantities, and remove items
- [x] 5.4 Calculate and display subtotal and totals

## 6. Checkout and Payment

- [x] 6.1 Build Checkout form to capture shipping and billing details
- [x] 6.2 Integrate payment gateway mock or real provider (e.g., Stripe)
- [x] 6.3 Implement logic to save the order to Supabase upon successful payment and clear the cart

## 7. Reviews and Order History

- [x] 7.1 Build User Profile page to display past orders
- [x] 7.2 Implement "Write a Review" form on the Product Details page for authenticated users
- [x] 7.3 Display product reviews and calculate average rating
