Sistema Bancario - Authentication Service
Nota: Este proyecto fue desarrollado con fines didácticos como parte del curso de arquitectura de microservicios de IN6AM. Forma parte de una serie de servicios independientes que conforman la aplicación completa del sistema bancario.
Descripción
Microservicio de autenticación y gestión de usuarios para la plataforma del sistema bancario. Este servicio maneja el registro, inicio de sesión y gestión de perfiles de usuario, además de la administración de operaciones bancarias como cuentas, transacciones, préstamos y empleados.
Implementa arquitectura limpia (Clean Architecture) con capas bien definidas: API, Application, Domain y Persistence.
Funcionalidades Principales
Autenticación y Autorización

Registro de usuarios con validación de datos
Inicio de sesión con JWT
Protección de rutas con JWT Bearer Authentication
Sistema de roles y permisos (ADMIN_ROLE, USER_ROLE)

Gestión de Usuarios

Perfiles de usuario
Consulta de perfil autenticado
Sistema de roles y permisos

Gestión Bancaria

Administración de clientes
Gestión de cuentas bancarias
Registro de transacciones
Control de préstamos
Gestión de empleados

Seguridad

Hashing de contraseñas con Argon2
Tokens JWT con expiración configurable
Middleware de manejo global de excepciones
Validación de datos con FluentValidation
Headers de seguridad (HSTS, XSS Protection, etc.)

Observabilidad

Logging estructurado con Serilog
Logs en consola y archivos con rotación diaria
Health check endpoint
Documentación Swagger/OpenAPI

Tecnologías Utilizadas
Backend

Framework: ASP.NET Core 8.0
Lenguaje: C# (.NET 8)
Arquitectura: Clean Architecture (4 capas)

Base de Datos

ORM: Entity Framework Core 9.0
Base de Datos: PostgreSQL
Migraciones: EF Core Migrations
Naming Convention: Snake case (EFCore.NamingConventions 9.0.0)

Seguridad

JWT: System.IdentityModel.Tokens.Jwt
Hashing: Argon2 (Konscious.Security.Cryptography.Argon2)
Authentication: Microsoft.AspNetCore.Authentication.JwtBearer 8.0.20
Headers: NetEscapades.AspNetCore.SecurityHeaders 1.2.0

Validación y Logging

Validación: FluentValidation
Logging: Serilog.AspNetCore 9.0.0
Documentación: Swashbuckle.AspNetCore 9.0.4 (Swagger)

Endpoints API
Base URL: http://localhost:5000/api
Autenticación (/auth)
MétodoRutaDescripciónAuthPOST/auth/registerRegistrar nuevo usuarioNoPOST/auth/loginIniciar sesiónNo
Administración (/admin)
MétodoRutaDescripciónAuthGET/admin/meObtener perfil autenticadoSíGET/admin/only-adminEndpoint solo para administradoresSí (ADMIN_ROLE)
Salud (/health)
MétodoRutaDescripciónAuthGET/healthEstado del servicioNo
Modelos de Request
Registro (/auth/register)
json{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dpi": "1234567890101",
  "direccion": "Zona 10, Ciudad de Guatemala",
  "telefono": "12345678",
  "correo": "juan.perez@ejemplo.com",
  "password": "Contraseña123!"
}
Login (/auth/login)
json{
  "username": "juan.perez@ejemplo.com",
  "password": "Contraseña123!"
}
Estructura del Proyecto
auth-service/
├── src/
│   ├── AuthService.Api/              # Capa de presentación
│   │   ├── Controllers/              # Controladores REST
│   │   │   ├── AuthController.cs
│   │   │   ├── AdminController.cs
│   │   │   └── HealthController.cs
│   │   ├── Extencions/               # Configuraciones y extensiones
│   │   │   └── ServiceColletionExtensions.cs
│   │   ├── Properties/               # Configuración de launch
│   │   │   └── launchSettings.json
│   │   ├── appsettings.json          # Configuración principal
│   │   ├── appsettings.Development.json  # Configuración desarrollo
│   │   ├── AuthService.Api.csproj    # Archivo de proyecto
│   │   ├── AuthService.Api.http      # Archivo de pruebas HTTP
│   │   └── Program.cs                # Punto de entrada
│   │
│   ├── AuthService.Application/      # Capa de aplicación
│   │   ├── DTOs/                     # Data Transfer Objects
│   │   │   ├── AuthResponseDto.cs
│   │   │   ├── LoginDto.cs
│   │   │   ├── RegisterDto.cs
│   │   │   └── UserDetailsDto.cs
│   │   ├── Interfaces/               # Interfaces de servicios
│   │   │   ├── IAuthService.cs
│   │   │   ├── IJwtService.cs
│   │   │   └── IPasswordHashService.cs
│   │   ├── Services/                 # Implementación de servicios
│   │   │   ├── AuthService.cs
│   │   │   ├── JwtService.cs
│   │   │   ├── PasswordHashService.cs
│   │   │   └── UuidGenerator.cs
│   │   └── AuthService.Application.csproj
│   │
│   ├── AuthService.Domain/           # Capa de dominio
│   │   ├── Constants/                # Constantes del dominio
│   │   │   └── RoleConstants.cs
│   │   ├── Entities/                 # Entidades del dominio
│   │   │   ├── Cliente.cs           # Entidad de clientes
│   │   │   ├── Cuenta.cs            # Entidad de cuentas bancarias
│   │   │   ├── Empleado.cs          # Entidad de empleados
│   │   │   ├── Prestamo.cs          # Entidad de préstamos
│   │   │   ├── Role.cs              # Entidad de roles
│   │   │   ├── Transaccion.cs       # Entidad de transacciones
│   │   │   └── UserRole.cs          # Relación usuarios-roles
│   │   ├── Enums/                    # Enumeraciones
│   │   │   └── UserRole.cs
│   │   ├── Interfaces/               # Interfaces de repositorios
│   │   │   ├── IClienteRepository.cs
│   │   │   ├── ICuentaRepository.cs
│   │   │   ├── IEmpleadoRepository.cs
│   │   │   ├── IPrestamoRepository.cs
│   │   │   ├── IRoleRepository.cs
│   │   │   ├── ITransaccionesRepository.cs
│   │   │   └── IUserRepository.cs
│   │   └── AuthService.Domain.csproj
│   │
│   └── AuthService.Persistence/      # Capa de persistencia
│       ├── Data/                     # DbContext y configuraciones
│       │   ├── ApplicationDbContext.cs
│       │   └── DataSeeder.cs
│       ├── Migrations/               # Migraciones de EF Core
│       │   ├── 20260215013748_InitialAdded.cs
│       │   ├── 20260215013748_InitialAdded.Designer.cs
│       │   └── ApplicationDbContextModelSnapshot.cs
│       ├── Repositories/             # Implementación de repositorios
│       │   └── InMemoryUserRepository.cs
│       └── AuthService.Persistence.csproj
│
├── AuthService.sln                   # Solución de Visual Studio
├── global.json                       # Versión de .NET
└── README.md                         # Este archivo
Configuración
Requisitos Previos

.NET 8.0 SDK o superior
PostgreSQL 13 o superior
Visual Studio 2022, Visual Studio Code, o Rider

Variables de Configuración
Crear appsettings.Development.json en src/AuthService.Api/:
json{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sistema_bancario;Username=ADMIN;Password=Admin2026;Port=5435"
  },
  "JwtSettings": {
    "SecretKey": "tu-clave-secreta-muy-segura-minimo-32-caracteres",
    "Issuer": "SistemaBancario",
    "Audience": "SistemaBancario",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
Instalación y Ejecución
1. Clonar el repositorio
bashgit clone <url-repositorio>
cd authentication-service/auth-service
2. Restaurar dependencias
bashdotnet restore
3. Aplicar migraciones a la base de datos
bashcd src/AuthService.Api
dotnet ef database update
4. Ejecutar el servicio
bashdotnet run
El servicio estará disponible en: http://localhost:5000
Documentación Swagger/OpenAPI
La documentación interactiva de la API está disponible en:

Interfaz Swagger UI: http://localhost:5000/swagger
Especificación JSON: http://localhost:5000/swagger/v1/swagger.json

Accede a Swagger para explorar todos los endpoints, ver ejemplos de request/response y probar la API directamente desde el navegador.
Seguridad
Headers de Seguridad

HSTS (HTTP Strict Transport Security)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer

JWT

Tokens con tiempo de expiración configurable
Validación de issuer y audience
Almacenamiento seguro de claves
Algoritmo de firma: HS256

Hashing de Contraseñas

Algoritmo: Argon2id
Configuración de parámetros de seguridad optimizados
Protección contra ataques de fuerza bruta

Logging
Los logs se almacenan en:

Consola: Formato simplificado para desarrollo
Archivos: logs/auth-service-YYYY-MM-DD.txt (rotación diaria)

Configuración:

Retención: 30 días
Nivel mínimo: Information en desarrollo
Formato: JSON estructurado en archivos

Desarrollo
Crear una nueva migración
bashcd src/AuthService.Api
dotnet ef migrations add NombreDeLaMigracion
dotnet ef database update
Ejecutar pruebas HTTP
El archivo src/AuthService.Api/AuthService.Api.http contiene ejemplos de solicitudes HTTP para probar los endpoints localmente.
Modelo de Datos
Entidades Principales
Cliente

IdCliente (PK)
Nombre, Apellido
DPI (único)
Dirección, Teléfono, Correo
CreatedAt, UpdatedAt

Cuenta

IdCuenta (PK)
NumeroCuenta (único)
TipoCuenta
Saldo
FechaApertura
IdCliente (FK)

Transaccion

IdTransaccion (PK)
Tipo (depósito, retiro, transferencia)
Monto
Fecha
IdCuentaOrigen (FK)
IdCuentaDestino (FK, nullable)

Prestamo

IdPrestamo (PK)
Monto
Interes
Plazo
FechaSolicitud
IdCliente (FK)

Empleado

IdEmpleado (PK)
Nombre, Apellido
Cargo
Teléfono, Correo

Role y UserRole

Sistema de roles y permisos
Relación muchos a muchos entre usuarios y roles

Licencia
Este proyecto está licenciado bajo la Licencia MIT.
Autor
Proyecto desarrollado como parte del grupo los codiguitos curso IN6AM - Guatemala 2026
Microservicios Relacionados
Este servicio es parte de la arquitectura de microservicios del sistema bancario:

Authentication Service (este repositorio)
Accounts Management Service
Transactions Service
Loans Service
API Gateway

Nota: Este es un proyecto educativo desarrollado como parte del aprendizaje de arquitectura de microservicios. No está destinado para uso en producción sin las debidas validaciones y pruebas de seguridad adicionales.