## Context

Actualmente disponemos de un sistema de login por modal y una sección básica de 4 productos en la página de inicio para usuarios logueados. El usuario solicita una interfaz más rica con 7-8 productos.

## Goals / Non-Goals

**Goals:**

- Crear una interfaz de cliente dedicada (Dashboard).
- Mostrar 7-8 productos con imagen, título, descripción y precio.
- Mantener la coherencia estética con el resto de la web.
- Asegurar que la interfaz sea accesible inmediatamente tras el login.

**Non-Goals:**

- No se implementará todavía la gestión de pedidos real o perfiles complejos.
- No se creará un sistema de recomendaciones basado en IA (solo selección por fecha o aleatoria).

## Decisions

1. **Uso de ProfilePage como Dashboard:** Reutilizaremos y ampliaremos `src/components/pages/ProfilePage.tsx` para que actúe como el dashboard principal del cliente, ya que ya tiene la lógica de protección de ruta y contexto de usuario.
2. **Cuadrícula Responsiva:** Usaremos CSS Grid para mostrar 2 columnas en móvil, 3 en tablet y 4 en desktop para acomodar los 8 productos de forma elegante.
3. **Consulta Extendida:** Se aumentará el límite del `limit(4)` actual a `limit(8)` en la consulta de Supabase.

## Risks / Trade-offs

- **[Riesgo]** Carga lenta de imágenes → **[Mitigación]** Usar cargas diferidas o placeholders que ya existen en el sistema.
- **[Riesgo]** Confusión entre la página de productos y el dashboard → **[Mitigación]** Diferenciar visualmente con un título de sección claro como "Tu Selección Exclusiva".
