## ADDED Requirements

### Requirement: Búsqueda de productos por términos extraídos

El sistema SHALL buscar productos en la tabla `products` de Supabase usando los `searchTerms` devueltos por Gemini. La búsqueda SHALL ser case-insensitive (`ilike`) sobre los campos `name` y `description`. El resultado SHALL estar limitado a un máximo de 3 productos.

#### Scenario: Búsqueda con coincidencias

- **WHEN** `searchTerms` contiene `["teclado"]`
- **THEN** la query devuelve hasta 3 productos donde `name ilike '%teclado%'` OR `description ilike '%teclado%'`

#### Scenario: Búsqueda sin coincidencias

- **WHEN** `searchTerms` contiene `["abcxyz123"]` (sin match)
- **THEN** la función devuelve un array vacío `[]`

#### Scenario: Múltiples términos

- **WHEN** `searchTerms` contiene `["teclado", "mecánico"]`
- **THEN** se aplican ambos filtros con OR: `name ilike '%teclado%' OR name ilike '%mecánico%'`

---

### Requirement: Datos devueltos de cada producto

Cada producto en los resultados SHALL incluir `id`, `name`, `price`, `image_url`, `category` y `description` (truncada a 100 caracteres para el chat). El cliente usará el `id` para construir el link `/products/[id]`.

#### Scenario: Productos con imagen

- **WHEN** un producto tiene `image_url` definida
- **THEN** la tarjeta en el chat muestra la imagen del producto

#### Scenario: Productos sin imagen

- **WHEN** `image_url` es null
- **THEN** la tarjeta muestra un placeholder de imagen genérico

---

### Requirement: Tarjeta de producto interactiva en el chat

El chatbot SHALL renderizar los productos encontrados como tarjetas visuales dentro del flujo de mensajes. Cada tarjeta SHALL mostrar imagen, nombre, precio formateado en EUR y un botón "Ver producto" que navega a `/products/[id]`.

#### Scenario: Click en "Ver producto"

- **WHEN** el usuario hace click en el botón "Ver producto" de una tarjeta
- **THEN** el navegador navega a `/products/[id]` mostrando la página completa del producto
