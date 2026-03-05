## admin-users

User management within the admin panel: listing, role change, purchase history, and restricted deletion.

### Requirements

1. The system SHALL display all users in a table with columns: Email, Role, Registered Date, Actions.
2. The system SHALL provide a search field to filter users by email.
3. The system SHALL allow changing a user's role (admin ↔ user) via a dropdown or toggle.
4. The system SHALL provide a button to view a user's order history in a modal.
5. The order history modal SHALL list all orders for that user with: Order ID, Date, Status, Total, and a list of items.
6. The system SHALL allow deleting a user with a confirmation dialog.
7. The system SHALL NOT display a delete button for the currently authenticated admin's own row.
8. The RLS policy SHALL prevent a user from deleting their own profile, even if the frontend guard is bypassed.
9. The system SHALL NOT allow removing the last user with role `admin`.

### Scenarios

- WHEN an admin opens the users page, THEN all user profiles are fetched and displayed.
- WHEN an admin searches by email, THEN the table filters to matching users.
- WHEN an admin changes a user's role, THEN the role is updated in `profiles` and reflected immediately.
- WHEN an admin clicks "Ver pedidos" on a user, THEN a modal opens with that user's orders and items.
- WHEN an admin clicks "Eliminar" on another user and confirms, THEN the user is deleted.
- WHEN an admin views their own row, THEN no delete button is shown.
- WHEN an admin attempts to delete the last admin via the API, THEN the request is rejected.
