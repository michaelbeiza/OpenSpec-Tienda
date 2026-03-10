## ADDED Requirements

### Requirement: Chatbot visible solo para usuarios autenticados

El widget de chat flotante SHALL renderizarse únicamente cuando el usuario tenga una sesión activa en el `AuthContext`. Si el usuario no está autenticado, el widget SHALL estar completamente oculto (no renderizado en el DOM).

#### Scenario: Usuario no autenticado

- **WHEN** un visitante accede a cualquier página sin iniciar sesión
- **THEN** el widget del chatbot no aparece en ningún lugar de la página

#### Scenario: Usuario autenticado

- **WHEN** un usuario inicia sesión correctamente
- **THEN** el botón flotante del chatbot aparece en la esquina inferior derecha de la página

---

### Requirement: Botón flotante de apertura

El widget SHALL mostrar un botón circular flotante con un ícono de chat en la esquina inferior derecha (`bottom: 24px; right: 24px`). El botón SHALL tener un diseño glassmorphism con el color primario de la tienda.

#### Scenario: Estado cerrado

- **WHEN** la ventana de chat está cerrada
- **THEN** el botón flotante es visible con un ícono de mensaje (💬 o SVG)

#### Scenario: Abrir el chat

- **WHEN** el usuario hace click en el botón flotante
- **THEN** la ventana de chat se abre con una animación de slide-up

#### Scenario: Cerrar el chat

- **WHEN** el usuario hace click en la X de la ventana
- **THEN** la ventana se cierra con animación y el botón flotante queda visible

---

### Requirement: Saludo personalizado al iniciar sesión

Al detectar que el usuario acaba de iniciar sesión (cambio de `null` a usuario en `AuthContext`), el bot SHALL abrir automáticamente el chat y mostrar un mensaje de bienvenida personalizado con el nombre o email del usuario. Este comportamiento SHALL ocurrir solo una vez por sesión (usando `sessionStorage`).

#### Scenario: Primera visita tras login

- **WHEN** el usuario inicia sesión y es su primera vez en la sesión
- **THEN** el chat se abre automáticamente con el mensaje "¡Hola [nombre]! 👋 Soy tu asistente de compras. ¿Qué estás buscando hoy?"

#### Scenario: Navegación entre páginas tras login

- **WHEN** el usuario navega a otra página después de haber iniciado sesión
- **THEN** el chat NO se abre automáticamente de nuevo (sessionStorage marca la sesión como ya saludada)

---

### Requirement: Ventana de chat con historial de mensajes

La ventana SHALL mostrar el historial cronológico de la conversación actual con distinción visual entre mensajes del usuario (derecha, color primario) y del bot (izquierda, color superficie). El historial SHALL preservarse mientras el usuario esté en la misma sesión del navegador.

#### Scenario: Visualización de mensajes

- **WHEN** el usuario envía un mensaje y el bot responde
- **THEN** ambos mensajes aparecen en la conversación con diferente alineación y color

#### Scenario: Scroll automático

- **WHEN** se añade un nuevo mensaje (usuario o bot)
- **THEN** la ventana hace scroll automático al último mensaje

---

### Requirement: Campo de entrada de texto

La ventana SHALL incluir un campo de texto en la parte inferior con un botón de envío. El usuario MUST poder enviar mensajes presionando Enter o haciendo click en el botón. Durante el procesamiento SHALL aparecer un indicador de "pensando..." y el campo SHALL estar deshabilitado.

#### Scenario: Envío con Enter

- **WHEN** el usuario escribe un mensaje y presiona Enter
- **THEN** el mensaje se envía y el campo se vacía

#### Scenario: Estado de carga

- **WHEN** el bot está procesando la respuesta
- **THEN** aparece un indicador animado ("...") y el campo de entrada está deshabilitado
