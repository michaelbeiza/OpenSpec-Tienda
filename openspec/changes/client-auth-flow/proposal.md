## Why

El usuario necesita una forma de registrarse y acceder a una cuenta de cliente en la tienda, manteniendo la estética de la página. Actualmente no existe un flujo de creación de cuenta ni de inicio de sesión para clientes. Implementar un widget emergente para el registro y el inicio de sesión mejorará la experiencia del usuario y permitirá el acceso a una interfaz personalizada.

## What Changes

- Creación de un widget modal para el registro de clientes ("Crear cuenta" / "Registrarse").
- Creación de un widget modal para el inicio de sesión ("Entrar").
- Integración de estos widgets con la interfaz principal, manteniendo los estilos y diseño actuales.
- Creación de una vista o interfaz básica ("interfaz de cliente") que se mostrará al iniciar sesión exitosamente.

## Capabilities

### New Capabilities

- `client-auth`: Manejo de registro (creación de cuenta) y acceso (inicio de sesión) de clientes a través de un widget emergente.
- `client-dashboard`: Interfaz de usuario para clientes autenticados.

### Modified Capabilities

- N/A

## Impact

- Interfaz de la aplicación principal (se agregarán botones y modales).
- Estado global de la aplicación para manejar la sesión del usuario.
- Enrutamiento o renderizado condicional para mostrar la "interfaz de cliente" una vez autenticado.
