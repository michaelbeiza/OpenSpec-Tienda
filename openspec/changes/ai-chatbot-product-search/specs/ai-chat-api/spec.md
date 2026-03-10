## ADDED Requirements

### Requirement: Endpoint POST /api/ai-chat

El sistema SHALL exponer un endpoint `POST /api/ai-chat` que acepte un body JSON con `{ message: string, history?: Message[] }`. El endpoint SHALL ser accesible solo desde el cliente autenticado (verificación de sesión con Supabase en el servidor).

#### Scenario: Petición válida autenticada

- **WHEN** un usuario autenticado envía `POST /api/ai-chat` con body `{ "message": "quiero un teclado" }`
- **THEN** el servidor responde con `200 OK` y body `{ "reply": "...", "products": [ Product[] ] }`

#### Scenario: Petición sin autenticación

- **WHEN** una petición llega sin cookie de sesión válida
- **THEN** el servidor responde con `401 Unauthorized`

#### Scenario: Petición con body vacío o inválido

- **WHEN** el body no contiene el campo `message` o es una cadena vacía
- **THEN** el servidor responde con `400 Bad Request`

---

### Requirement: Orquestación Gemini → Búsqueda → Respuesta

El endpoint SHALL enviar el mensaje del usuario a Gemini con un system prompt que force una respuesta JSON con `{ "message": string, "searchTerms": string[] }`. Con esos `searchTerms`, SHALL buscar productos en Supabase y combinar ambos resultados en la respuesta final.

#### Scenario: Consulta con intención de producto

- **WHEN** el usuario envía "quiero un teclado mecánico"
- **THEN** Gemini devuelve `searchTerms: ["teclado", "mecánico"]`, se busca en Supabase y se devuelven hasta 3 productos relevantes

#### Scenario: Consulta sin intención de producto

- **WHEN** el usuario envía "¿cómo estás?"
- **THEN** Gemini devuelve `searchTerms: []`, no se realiza búsqueda en Supabase y se devuelve solo el mensaje de respuesta del bot

#### Scenario: Error de Gemini

- **WHEN** la API de Gemini devuelve un error o timeout
- **THEN** el endpoint responde con `500` y mensaje de error amigable
