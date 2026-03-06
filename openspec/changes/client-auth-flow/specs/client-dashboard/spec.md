## ADDED Requirements

### Requirement: Acceso a la Interfaz de Cliente

El sistema SHALL permitir el acceso o visualización de una interfaz/vista especial destinada solo a clientes autenticados.

#### Scenario: Visualización del enlace a mi cuenta

- **WHEN** el usuario inicia sesión de forma exitosa mediante los modales
- **THEN** los botones de login y registro son reemplazados por opciones relacionadas a la cuenta del cliente (ej. Mi Cuenta, Cerrar Sesión)

#### Scenario: Apertura de la interfaz de cliente

- **WHEN** el usuario autenticado decide explorar su información
- **THEN** se abre la "interfaz de cliente de la tienda" en donde a futuro se podrán gestionar preferencias, pedidos, etc.

### Requirement: Productos Destacados para Clientes

El sistema SHALL mostrar una selección de productos destacados en la interfaz principal o en la interfaz de cliente una vez que la sesión esté iniciada.

#### Scenario: Visualización de productos al iniciar sesión

- **WHEN** el usuario inicia sesión exitosamente
- **THEN** la interfaz principal (o el dashboard) muestra una sección de "Productos Recomendados" con el estilo visual de la tienda (tarjetas de productos)
