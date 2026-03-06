## Context

Actualmente la tienda no cuenta con un sistema para que los clientes se registren y gestionen sus cuentas (iniciar sesión, ver su interfaz de cliente). Todo se realiza de manera anónima. La implementación de un flujo de autenticación de clientes permitirá personalizar la experiencia de usuario y acceder a funcionalidades exclusivas. Se solicita una "ventanita" o widget para que el proceso fluya sin recargar la página asumiendo o incorporando el estilo actual de la web.

## Goals / Non-Goals

**Goals:**

- Implementar un widget modal responsivo para el registro e inicio de sesión de usuarios.
- Mantener el diseño coherente con el estilo actual de la tienda.
- Mostrar una vista básica ("interfaz de cliente") cuando el usuario haya iniciado sesión existosamente ("entrar").
- Integrar la lógica de manejo de estado en el frontend (ej. React) para saber si el cliente está autenticado.

**Non-Goals:**

- Implementar la recuperación de contraseña por correo en esta primera iteración.
- Integraciones complejas con backend real para la sesión (se puede hacer un mock con localStorage por el momento, o como esté arquitecturada la web actual).
- Proveedores de autenticación externos (Google, Facebook).

## Decisions

- **Modales UI**: Construir y usar un componente `AuthModal` o utilizar diálogos HTML5 (o la librería de UI vigente) para crear el widget requerido sin recargar la página.
- **Gestión de Estado de Sesión**: Como es una tienda React, la información del usuario logueado en una variable de estado del componente `App` u otra solución de estado sencilla para determinar dinámicamente si mostrar botones de inicio de sesión o mostrar al usuario la interfaz de cliente.
- **Mock Authentication**: Usar un objeto simple en memoria o en el `localStorage` del navegador para que la creación de cuenta funcione con el "entrar".

## Risks / Trade-offs

- **Experiencia Móvil**: Modales pesados pueden frustrar en móvil.
  - _Mitigación_: Responsive design con modales que abarquen toda la pantalla en resoluciones muy pequeñas y botones grandes.
- **Mock de datos**: Los usuarios registrados se pierden al recargar u olvidar el almacenamiento local, si no se conecta aún con el backend.
  - _Mitigación_: Suficiente para verificar que la UI funcione y conectar en siguientes etapas.
