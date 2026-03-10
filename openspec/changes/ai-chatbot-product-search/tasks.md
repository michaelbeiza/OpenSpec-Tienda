## 1. Librería de búsqueda con Gemini

- [x] 1.1 Crear `src/lib/gemini-chat.ts` con la función `extractSearchTerms(message: string): Promise<{ reply: string, searchTerms: string[] }>` que llama a `gemini-2.0-flash` con el system prompt definido en design.md
- [x] 1.2 Crear `src/lib/gemini-chat.ts` función `searchProductsByTerms(terms: string[]): Promise<Product[]>` que realiza la query `ilike` en Supabase sobre `name` y `description` con límite de 3 resultados
- [x] 1.3 Verificar que `GEMINI_API_KEY` está en `.env.local` (si usa nombre diferente al existente, actualizar la clave)

## 2. Endpoint de API del chat

- [x] 2.1 Crear `src/pages/api/ai-chat.ts` como Astro API Route que acepta `POST` con body `{ message: string }`
- [x] 2.2 Añadir validación: devolver `400` si `message` está vacío o falta
- [x] 2.3 Añadir verificación de sesión: devolver `401` si el usuario no está autenticado (usando Supabase server client)
- [x] 2.4 Integrar `extractSearchTerms` y `searchProductsByTerms` en el endpoint y devolver `{ reply, products }` con `200 OK`
- [x] 2.5 Añadir manejo de errores: capturar excepciones de Gemini y devolver `500` con mensaje amigable

## 3. Componente de Chatbot (Visual)

- [x] 3.1 Crear `src/components/ChatBot.tsx` con estado local: `isOpen`, `messages`, `inputValue`, `isLoading`
- [x] 3.2 Implementar el botón flotante circular (glassmorphism, bottom-right, `z-index: 9000`) que toggle `isOpen`
- [x] 3.3 Implementar la ventana de chat con: header con nombre del bot y botón X, área de mensajes con scroll, área de input
- [x] 3.4 Aplicar estilos glassmorphism consistent con el design system de la tienda (`--color-surface`, `--color-primary`, `--color-border`, `backdrop-filter: blur`)
- [x] 3.5 Implementar el tipo `Message = { role: 'user' | 'bot', text: string, products?: Product[] }` y renderizar mensajes con distinción visual (user: derecha/primario, bot: izquierda/superficie)
- [x] 3.6 Implementar tarjeta de producto en el chat: imagen, nombre, precio en EUR, botón "Ver producto" que hace `window.location.href = /products/${id}`
- [x] 3.7 Implementar indicador de "pensando..." animado (3 puntos pulsantes) mientras `isLoading === true`
- [x] 3.8 Añadir scroll automático al último mensaje al actualizar `messages`

## 4. Lógica de saludo y autenticación

- [x] 4.1 En `ChatBot.tsx`, suscribirse al `user` del `AuthContext`. Cuando cambia de `null` a un valor, comprobar `sessionStorage.getItem('chatbot-greeted')`
- [x] 4.2 Si no hay flag en sessionStorage, abrir el chat (`setIsOpen(true)`), añadir el mensaje de saludo personalizado y guardar `sessionStorage.setItem('chatbot-greeted', 'true')`
- [x] 4.3 Conectar el formulario de envío con el endpoint `/api/ai-chat` via `fetch` y actualizar `messages` con la respuesta

## 5. Integración en el Layout

- [x] 5.1 Importar y añadir `<ChatBot client:only="react" />` al final del `<body>` en `src/layouts/Layout.astro`
- [x] 5.2 Verificar que el `AuthContext` y `CartContext` están disponibles como providers antes del componente ChatBot (revisar el wrapper actual)

## 6. Pruebas manuales

- [ ] 6.1 Verificar que el widget NO aparece cuando el usuario no está autenticado
- [ ] 6.2 Verificar que el bot saluda con el nombre/email al hacer login por primera vez en la sesión
- [ ] 6.3 Enviar "quiero un teclado" y confirmar que aparecen tarjetas de productos relevantes
- [ ] 6.4 Confirmar que el botón "Ver producto" navega correctamente a `/products/[id]`
- [ ] 6.5 Verificar que al recargar la página tras login, el chat NO se abre automáticamente (sessionStorage funciona)
- [ ] 6.6 Probar en modo claro y oscuro que el chatbot respeta los colores del tema
