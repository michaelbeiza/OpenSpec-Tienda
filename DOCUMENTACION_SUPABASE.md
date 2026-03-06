# 🛡️ Guía Técnica: Integración de Supabase y Flujo de Autenticación Pro

Este documento detalla el proceso de migración de datos locales a una arquitectura en la nube utilizando **Supabase**, incluyendo la resolución de problemas de conexión y la implementación de un flujo de verificación de correo electrónico profesional.

---

## 1. Requerimientos y "Prompts" del Usuario

Durante el desarrollo, se abordaron los siguientes desafíos planteados por el usuario para evolucionar la plataforma:

### Fase 1: Sistema de Autenticación de Cliente (Client Login Flow)

1.  **Integración de UI**: _"Añade un botón de login en la navbar que abra un modal elegante para iniciar sesión o registrarse."_
2.  **Gestión de Estado**: _"Necesito que la web sepa si estoy logueado o no para mostrar mi perfil o el botón de entrar."_
3.  **Diseño Moderno**: _"Crea un modal con un diseño premium, que use cristalografía (glassmorphism) y animaciones suaves."_
4.  **Flujo de Registro**: _"Añade la opción de crear cuenta desde el mismo modal de login."_

### Fase 2: Conexión y Verificación con Supabase

1.  **Conexión Identitaria**: _"¿Cómo puedo comprobar que la web está conectada a MI base de datos y no a otra?"_
2.  **Sincronización de Schema**: \*"Me sale error porque la columna 'long*description' no existe en mi tabla."*
3.  **Flujo de Verificación Humano**: _"Quiero una propuesta integral para el flujo de verificación: diseño de email, generación de tokens seguros y estados de éxito/error."_
4.  **Eficiencia de Servicio**: _"Voy a usar el servicio nativo de Supabase en lugar de uno personalizado."_
5.  **UX Final**: _"Cuando el usuario cierre sesión, debe volver automáticamente a la página de inicio."_

---

## 2. Implementación Técnica (El "Cómo se hizo")

### A. Sistema de Login de Cliente (Auth Flow)

Se implementó un sistema de autenticación híbrido que evolucionó de una simulación local a una integración real con Supabase:

- **AuthContext con React**: Creación de un `context` global para gestionar el estado del usuario (`user`), la sesión (`session`) y los datos del perfil (`profile`) en toda la aplicación.
- **Modales Dinámicos**: Implementación del `AuthModal` en `App.tsx`, permitiendo alternar entre las vistas de "Iniciar Sesión" y "Registro" sin recargar la página.
- **Persistencia de Datos**: Configuración de `onAuthStateChange` para mantener al usuario conectado incluso después de refrescar el navegador.

### B. Conexión de Datos (Seguridad de Entorno)

Se configuró un sistema de variables de entorno robusto en `.env.local` y se creó un cliente singleton en `src/lib/supabase.ts`.

- **Debug Visual**: Se añadió un identificador de proyecto en el pie de página de productos para verificación en tiempo real del ID del proyecto.

### C. Inicialización de la Base de Datos (SQL Engine)

Se desarrolló un script de inicialización (`supabase_init.sql`) que realiza las siguientes acciones:

- Limpieza de esquema mediante `DROP TABLE IF EXISTS`.
- Creación de tablas relacionales: `profiles` (perfiles), `products` (catálogo) y `reviews` (opiniones).
- Configuración de **Row Level Security (RLS)** para asegurar que los usuarios solo puedan editar sus propios datos.
- Inserción de datos "Seed" con imágenes de alta calidad (Unsplash) y categorías tecnológicas.

### C. Sistema de Verificación de Email

Siguiendo la propuesta del usuario, se implementó el flujo en dos fases:

1.  **Lógica React**: Creación del componente `VerifyPage.tsx` que maneja tres estados visuales:
    - **Cargando ⏳**: Comprobando el estado del usuario.
    - **Éxito ✅**: Cuenta confirmada y feedback positivo.
    - **Error ❌**: Enlace caducado o token inválido.
2.  **Auth Integration**: Se modificó el `AuthContext.tsx` para usar el método `signUp` de Supabase con redirección automática a la nueva página de verificación.

---

## 3. Guía para Usuarios: "Hazlo tú mismo" (Paso a Paso)

Si quieres replicar este sistema en otro proyecto, sigue estos pasos:

### Paso 1: Configurar Supabase

1.  Crea un proyecto en [Supabase.com](https://supabase.com).
2.  Ve a **Project Settings -> API** y copia la `URL` y la `anon key`.
3.  Crea un archivo `.env.local` en tu proyecto y pégalas:
    ```env
    PUBLIC_SUPABASE_URL=tu_url
    PUBLIC_SUPABASE_ANON_KEY=tu_clave
    ```

### Paso 2: Preparar la Base de Datos

1.  Ve al **SQL Editor** de Supabase.
2.  Pega el contenido del script de inicialización (puedes encontrarlo en este repositorio).
3.  Haz clic en **Run**. Esto creará tus tablas y productos de ejemplo.

### Paso 3: Activar el Correo de Confirmación

1.  En Supabase, ve a **Authentication -> Settings**.
2.  Activa **"Confirm Email"**.
3.  En **"Site URL"**, pon la dirección de tu web (ej: `http://localhost:4321`).
4.  (Opcional) Configura tu propio SMTP en **SMTP Settings** si quieres que los correos lleguen al instante y no tengan límites de envío.

### Paso 4: Lógica de Cierre de Sesión

Para que el usuario no se quede en una página vacía al salir, usa este patrón en tu función de `signOut`:

```javascript
const signOut = async () => {
  await supabase.auth.signOut();
  window.location.href = "/"; // Redirección forzada al home
};
```

---

## 4. Solución de Problemas Comunes (FAQ)

- **¿Por qué no carga mi web?** Revisa si tienes dos terminales corriendo a la vez. Cierra todas y ejecuta `npm run dev` una sola vez.
- **¿Por qué no me llega el email?** El servicio gratuito de Supabase permite 3 envíos por hora. Si fallas mucho, espera 1 hora o confirma al usuario manualmente desde la pestaña **Users**.
- **¿Por qué sale error de columnas?** Si has modificado las tablas a mano, ejecuta el script SQL con los comandos `DROP TABLE` para resetear el esquema al estado correcto.
