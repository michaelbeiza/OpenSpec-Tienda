## admin-products

Full CRUD management of products within the admin panel.

### Requirements

1. The system SHALL display all products in a sortable table with columns: ID (truncated), Name, Price, Stock, Image, Actions.
2. The system SHALL provide an "Add Product" button that opens a form/modal.
3. The form SHALL accept: name (required), description (required), price (required, ≥ 0), stock/inventory (required, ≥ 0), image URL (optional).
4. The system SHALL allow editing an existing product via an "Edit" button on each row.
5. The system SHALL allow deleting a product with a confirmation dialog.
6. The inventory SHALL reflect the currently stored value and update immediately after save.
7. All mutations MUST use the Supabase JS client (parameterized) — no raw SQL concatenation.

### Scenarios

- WHEN an admin opens the products page, THEN all products are fetched and displayed in the table.
- WHEN an admin submits a valid new product form, THEN the product is inserted and the table refreshes.
- WHEN an admin clicks Edit on a product, THEN the form is pre-filled with that product's data.
- WHEN an admin confirms deletion, THEN the product is removed from the DB and the table refreshes.
- WHEN an admin submits invalid data (e.g. negative price), THEN a validation error is shown.
