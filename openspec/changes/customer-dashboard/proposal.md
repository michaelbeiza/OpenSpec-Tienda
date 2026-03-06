## Why

Se requiere una interfaz de cliente dedicada que se muestre tras el inicio de sesión, proporcionando una experiencia personalizada con una selección más amplia de productos (7-8 productos) para fomentar la interacción y las ventas.

## What Changes

- Creación de una nueva página o mejora del componente de interfaz de cliente existente.
- Implementación de una cuadrícula de productos con 7-8 artículos, incluyendo imágenes, precios y descripciones.
- Integración de esta interfaz para que se abra automáticamente o sea fácilmente accesible tras el login exitoso.

## Capabilities

### New Capabilities

- `customer-product-grid`: Interfaz extendida que muestra una selección curada de 7-8 productos para clientes autenticados.

### Modified Capabilities

- `client-dashboard`: Se extenderá para incluir la navegación y visualización de esta nueva cuadrícula extendida.

## Impact

- `src/components/pages/ProfilePage.tsx` o un nuevo `CustomerDashboard.tsx`.
- Lógica de consulta a la base de datos para obtener más productos.
- Estilos CSS para la cuadrícula de productos.
