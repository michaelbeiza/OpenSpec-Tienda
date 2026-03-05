## ADDED Requirements

### Requirement: Product Browsing and Discovery
The system MUST allow users to view a list of available products, view detailed information for individual products, and filter the products based on criteria such as category or price. Only regular users and guests can browse, while admins can manage.

#### Scenario: Viewing product list
- **WHEN** a user navigates to the products page
- **THEN** the system displays a list of available products with their basic details (name, price, image)

#### Scenario: Viewing product details
- **WHEN** a user clicks on a specific product
- **THEN** the system displays the comprehensive details for that product, including description, inventory status, and reviews

### Requirement: Product Administration
The system MUST allow administrators to manage the product catalog, including updating pricing, viewing purchase history per product, and deleting products.

#### Scenario: Admin updates a product price
- **WHEN** an administrator modifies the price of an existing product and saves
- **THEN** the system updates the product record in the database with the new price

#### Scenario: Admin deletes a product
- **WHEN** an administrator chooses to delete a product
- **THEN** the system removes the product from the active catalog (or marks it as deleted) to prevent future purchases, while preserving historical order data
