## ADDED Requirements

### Requirement: Cart Management
The system MUST allow users to add products to their shopping cart, update the quantities of items in the cart, and remove items entirely.

#### Scenario: Adding an item to the cart
- **WHEN** a user clicks the "Add to Cart" button on a product page
- **THEN** the item is added to the user's active shopping cart

#### Scenario: Updating item quantity
- **WHEN** a user changes the quantity of an item in the cart view
- **THEN** the system recalculates the cart total based on the new quantity

#### Scenario: Removing an item from the cart
- **WHEN** a user clicks the "Remove" button next to a cart item
- **THEN** the item is removed from the cart and the total is updated
