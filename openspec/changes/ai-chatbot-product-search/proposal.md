## Why

Los usuarios de la tienda no tienen una forma intuitiva de encontrar productos usando lenguaje natural. Actualmente deben navegar por categorías o buscar por palabras exactas; no existe un asistente que entienda peticiones como "quiero algo para jugar" o "busco un teclado mecánico". La tienda ya cuenta con `@google/generative-ai` instalado y una infraestructura en Supabase con productos catalogados, lo que hace que este sea el momento ideal para añadir un chatbot de IA con navegación inteligente.

## What Changes

- **Nuevo componente de Chatbot (`ChatBot.tsx`)**: Widget flotante estilo glassmorphism (dark mode) visible en todas las páginas únicamente cuando el usuario ha iniciado sesión.
- **Saludo personalizado al iniciar sesión**: El bot se activa automáticamente al hacer login y saluda al usuario por su nombre con un mensaje de bienvenida.
- **Búsqueda con lenguaje natural vía Gemini**: El usuario puede escribir "quiero un teclado" y el bot analiza el catálogo de productos y devuelve resultados relevantes.
- **Tarjetas de producto en el chat**: El bot muestra el resultado como tarjetas interactivas (imagen, nombre, precio) con un botón "Ver producto" que navega directamente a la página del producto.
- **Nuevo endpoint de API (`/api/ai-chat`)**: Astro API Route que recibe el mensaje del usuario, lo procesa con Gemini Flash para extraer intención/términos clave, búsqueda en Supabase y devuelve respuesta formateada.
- **Integración en el Layout principal**: El componente `ChatBot` se añade al `Layout.astro` con `client:only="react"` para que esté disponible en todas las páginas.

## Capabilities

### New Capabilities

- `ai-chatbot-widget`: Widget de chat flotante (React) con diseño glassmorphism, estado abierto/cerrado, historial de conversación, entrada de texto e integración con contexto de autenticación.
- `ai-chat-api`: Endpoint Astro `/api/ai-chat` que orquesta la llamada a Gemini para entender intención del usuario y la búsqueda de productos en Supabase.
- `natural-language-product-search`: Lógica de búsqueda semántica/por texto que usa Gemini para extraer términos y los mapea a productos reales del catálogo de Supabase.

### Modified Capabilities

- `ai-product-search`: La búsqueda de productos existente en `search-ia.ts` se reutilizará/extenderá para servir también al chatbot, evitando duplicación de lógica.

## Impact

- **Nuevos archivos**: `src/components/ChatBot.tsx`, `src/pages/api/ai-chat.ts`, `src/lib/gemini-chat.ts`
- **Archivos modificados**: `src/layouts/Layout.astro` (añadir `<ChatBot client:only="react" />`)
- **Dependencias**: `@google/generative-ai` (ya instalada), `@supabase/supabase-js` (ya instalada)
- **Variables de entorno**: `GEMINI_API_KEY` (o la key existente), `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` (ya configuradas en `.env.local`)
- **Sin cambios en base de datos**: Se aprovechan los productos ya existentes en Supabase mediante búsqueda por texto (`ilike`) o búsqueda semántica si hay embeddings.
