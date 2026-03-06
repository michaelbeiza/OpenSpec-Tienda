## 1. Configuración de Componentes y Estado

- [x] 1.1 Crear el estado global o local básico (ej. en `Context` o en `App.tsx`) para los datos del usuario logueado (`user`, `setUser`, `showAuthModal`).
- [x] 1.2 Definir la interfaz TypeScript básica para el mock del usuario autenticado.

## 2. Desarrollo de los Widgets o Ventanitas

- [x] 2.1 Construir la estructura y estilos web del componente Modal para Registro y Login, asegurando que sigan el diseño actual.
- [x] 2.2 Construir el formulario de registro y su lógica de simulación (guardar usuario temporal en `localStorage` o en memoria local React).
- [x] 2.3 Construir la UI del formulario de inicio de sesión ("entrar") que valide contra el registro temporal y actualice el estado a "conectado".
- [x] 2.4 Controlar que una vez autenticado correctamente se cierre el widget modal automáticamente.

## 3. Interfaz del Cliente

- [x] 3.1 Modificar la navegación principal para reemplazar los botones de "Login"/"Registro" si el usuario está autenticado, visualizando en su lugar algo como "Mi Cuenta" o "Panel de Cliente".
- [x] 3.2 Crear una vista base sencilla que sirva como "interfaz del cliente" de la tienda (donde puedan ver sus datos mínimos o preferencias).
- [x] 3.3 Implementar una sección de "Productos Destacados" que se visualice solo para usuarios autenticados, siguiendo el estilo de `ProductsPage.tsx`.
- [x] 3.4 Implementar el botón para cerrar la sesión y volver a renderizar la navegación anónima original.
