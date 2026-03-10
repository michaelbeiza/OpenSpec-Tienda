## Context

La tienda online está construida con **Astro + React** (islands architecture), autenticación via **Supabase Auth** y catálogo de productos en **Supabase Postgres**. El paquete `@google/generative-ai` ya está instalado pero solo se usa en un endpoint experimental (`search-ia.ts` con `buscarProductos`). El diseño del sistema actual no expone ninguna interfaz conversacional al usuario final.

La arquitectura de islas de Astro significa que los componentes interactivos (React) deben cargarse con `client:only="react"` para tener acceso al contexto del usuario en el cliente.

## Goals / Non-Goals

**Goals:**

- Implementar un widget de chat flotante que aparece en todas las páginas cuando el usuario está autenticado.
- Procesar lenguaje natural (e.g., "quiero un teclado") con Gemini Flash para extraer términos de búsqueda.
- Devolver tarjetas de producto clicables directamente en el chat.
- Saludar al usuario por nombre al iniciar sesión (activación automática del bot).
- Mantener historial de mensajes durante la sesión del usuario.

**Non-Goals:**

- Persistir el historial de chat en la base de datos (solo en memoria/estado local).
- Búsqueda por embeddings vectoriales (se usa búsqueda por texto `ilike` en Supabase).
- Soporte multi-idioma (solo español).
- Chatbot de atención al cliente (solo navega y busca productos).
- Conversaciones contextuales largas (cada pregunta es relativamente independiente).

## Decisions

### Decisión 1: Arquitectura cliente-servidor del chat

**Elegida:** El componente `ChatBot.tsx` en el cliente llama a un endpoint Astro `/api/ai-chat.ts` en el servidor.

**Alternativa descartada:** Llamar directamente a la API de Gemini desde el cliente (React).

**Razón:** La API key de Gemini no debe exponerse en el bundle del cliente. El servidor actúa como proxy seguro, además de poder consultar Supabase con permisos de servidor si fuera necesario.

---

### Decisión 2: Estrategia de búsqueda de productos

**Elegida:** Gemini extrae palabras clave de la consulta del usuario → búsqueda `ilike` en Supabase sobre `name` y `description`.

**Alternativa descartada:** Embeddings vectoriales (pgvector).

**Razón:** El proyecto no tiene columna de embeddings configurada. La búsqueda textual es suficiente para el caso de uso inicial y no requiere cambios en el esquema de la base de datos. Se puede migrar a vectorial en el futuro.

---

### Decisión 3: Punto de integración en el Layout

**Elegida:** Añadir `<ChatBot client:only="react" />` directamente en `Layout.astro`.

**Razón:** El widget debe estar disponible en todas las páginas de la tienda sin tocar cada wrapper individual. Astro renderiza el Layout como shell y el componente React se hidrara en cliente con acceso al `AuthContext`.

---

### Decisión 4: Activación automática al login

**Elegida:** El componente escucha cambios en `user` del `AuthContext`. Cuando `user` pasa de `null` a un valor, muestra el chat abierto con el saludo.

**Razón:** La imagen de referencia muestra el bot activo desde el inicio de sesión. Usar el contexto existente evita duplicar lógica de auth.

---

### Decisión 5: System prompt de Gemini

```
Eres un asistente de compras para Tienda Mishe.
Tu única función es ayudar al usuario a encontrar productos.
Cuando el usuario mencione un producto o necesidad, extrae las palabras clave más relevantes para buscar en el catálogo.
Responde SIEMPRE en JSON con el formato: { "message": "...", "searchTerms": ["..."] }
Si no hay intención de compra, responde amablemente y pide que te digan qué buscan.
```

**Razón:** Respuesta estructurada en JSON evita parsing frágil de texto libre. `searchTerms` se pasa directamente a la query de Supabase.

## Risks / Trade-offs

| Riesgo                                              | Mitigación                                                                               |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Latencia de Gemini (~1-2s)                          | Mostrar indicador "pensando..." animado en el chat                                       |
| Resultados de búsqueda poco relevantes              | Limitar a top 3 productos; mostrar "No encontré resultados, prueba con otra búsqueda"    |
| API key de Gemini expuesta                          | Nunca en cliente; siempre en variables de entorno del servidor                           |
| El bot se abre involuntariamente en cada navegación | Usar `sessionStorage` para recordar si ya se saludó en la sesión actual                  |
| Coste de tokens de Gemini con muchas consultas      | Usar `gemini-2.0-flash` (el más barato y rápido), limitar historial a últimos 5 mensajes |
