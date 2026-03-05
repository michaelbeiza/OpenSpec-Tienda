## ADDED Requirements

### Requirement: Checkout Process
The system MUST process the user's shopping cart into a formalized order. The checkout process MUST capture the shipping address and pass billing totals to the payment system.

#### Scenario: Successful order placement
- **WHEN** a user completes the checkout form (address, payment method) and confirms
- **THEN** the system creates a new order record and clears the active shopping cart

### Requirement: Order History
The system MUST maintain a history of placed orders for each user. Users MUST be able to view their past orders, and administrators MUST be able to see purchase history for specific products.

#### Scenario: User views order history
- **WHEN** an authenticated user navigates to their profile/orders section
- **THEN** the system displays a list of their previously placed orders with statuses
