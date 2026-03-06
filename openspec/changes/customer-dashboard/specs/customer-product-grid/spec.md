## ADDED Requirements

### Requirement: Cuadrícula de Productos de Cliente

El sistema SHALL mostrar una sección prominente con 7-8 productos destacados en la interfaz dedicada del cliente (Dashboard).

#### Scenario: Visualización de lista completa de productos sugeridos

- **WHEN** un cliente autenticado accede a su panel o dashboard principal
- **THEN** se visualiza una cuadrícula responsiva que contiene al menos 7 productos con sus respectivas imágenes y detalles

### Requirement: Detalles de Producto en Dashboard

Cada ítem en la cuadrícula de productos SHAL incluir: imagen, nombre, descripción corta, precio y un botón de acción rápida para añadir al carrito.

#### Scenario: Interacción con producto desde el Dashboard

- **WHEN** el usuario hace clic en el botón "+ Carrito" de un producto en el dashboard
- **THEN** el sistema añade el producto al carrito y muestra una confirmación visual (toast)
