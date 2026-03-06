## ADDED Requirements

### Requirement: Registro de Cliente Modal

El sistema SHALL permitir que un usuario anónimo abra un widget o modal para proporcionar datos y crear una nueva cuenta.

#### Scenario: Abrir modal de crear cuenta

- **WHEN** el usuario anónimo hace clic en el botón de registrarse o crear cuenta en la navegación
- **THEN** se muestra un widget emergente conservando el estilo visual actual sin redirigir a una página nueva

#### Scenario: Registro exitoso

- **WHEN** el usuario envía el formulario con datos válidos
- **THEN** la sesión se crea (el mock guarda los datos localmente) y la UI refleja el estado del usuario autenticado cerrando el modal automáticamente

### Requirement: Inicio de Sesión Modal

El sistema SHALL permitir a un usuario existente abrir un widget para ingresar sus datos y autenticarse en caso de no tener sesión activa.

#### Scenario: Abrir modal de entrar

- **WHEN** el usuario anónimo hace clic en entrar o iniciar sesión
- **THEN** se muestra un widget modal con formulario de login

#### Scenario: Inicio de sesión exitoso

- **WHEN** el usuario ingresa las credenciales de la cuenta que acaba de originar en el flujo anterior y se validan
- **THEN** el sistema lo identifica como autenticado, cierra el widget y la navegación muestra el acceso a la cuenta o interfaz del cliente en vez de los botones de crear cuenta o entrar
