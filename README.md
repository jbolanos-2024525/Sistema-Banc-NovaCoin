# Sistema Bancario - Authentication Service

> Nota: Este proyecto fue desarrollado con fines didácticos como parte del curso de arquitectura de microservicios de IN6AM. Forma parte de una serie de servicios independientes que conforman la aplicación completa del sistema bancario.

---

# Descripción

Microservicio de autenticación y gestión de usuarios para la plataforma del sistema bancario.

Este servicio maneja:

- Registro de usuarios
- Inicio de sesión
- Gestión de perfiles
- Administración de clientes
- Cuentas bancarias
- Transacciones
- Préstamos
- Empleados

Implementa arquitectura limpia (**Clean Architecture**) con 4 capas:

- API
- Application
- Domain
- Persistence

---

# Funcionalidades Principales

## Autenticación y Autorización

- Registro de usuarios con validación de datos
- Inicio de sesión con JWT
- Protección de rutas con JWT Bearer Authentication
- Sistema de roles y permisos:
  - ADMIN_ROLE
  - USER_ROLE

## Gestión de Usuarios

- Perfiles de usuario
- Consulta de perfil autenticado
- Sistema de roles y permisos

## Gestión Bancaria

- Administración de clientes
- Gestión de cuentas bancarias
- Registro de transacciones
- Control de préstamos
- Gestión de empleados

## Seguridad

- Hashing de contraseñas con Argon2id
- Tokens JWT con expiración configurable
- Middleware de manejo global de excepciones
- Validación de datos con FluentValidation
- Security headers:
  - HSTS
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - Referrer-Policy

## Observabilidad

- Logging estructurado con Serilog
- Logs en consola
- Logs en archivos con rotación diaria
- Health check endpoint
- Documentación Swagger/OpenAPI

---

# Tecnologías Utilizadas

## Backend

- Framework: ASP.NET Core 8.0
- Lenguaje: C# (.NET 8)
- Arquitectura: Clean Architecture

## Base de Datos

- ORM: Entity Framework Core 9.0
- Base de Datos: PostgreSQL
- Migraciones: EF Core Migrations
- Naming Convention: Snake case

## Seguridad

- JWT: System.IdentityModel.Tokens.Jwt
- Hashing: Konscious.Security.Cryptography.Argon2
- Authentication: Microsoft.AspNetCore.Authentication.JwtBearer
- Headers: NetEscapades.AspNetCore.SecurityHeaders

## Validación y Logging

- Validación: FluentValidation
- Logging: Serilog.AspNetCore
- Documentación: Swashbuckle.AspNetCore (Swagger)

---

# Endpoints API

Base URL:

http://localhost:5000/api

## Autenticación (/auth)

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| POST | /auth/register | Registrar nuevo usuario | No |
| POST | /auth/login | Iniciar sesión | No |

## Administración (/admin)

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| GET | /admin/me | Obtener perfil autenticado | Sí |
| GET | /admin/only-admin | Endpoint solo para administradores | Sí (ADMIN_ROLE) |

## Salud (/health)

| Método | Ruta | Descripción | Auth |
|--------|------|------------|------|
| GET | /health | Estado del servicio | No |

---

# Modelos de Request

## Registro (/auth/register)

```json
{
  "nombre": "Fernando",
  "apellido": "Garcia",
  "dpi": "1234562890101",
  "direccion": "Zona 15, Ciudad de Guatemala",
  "telefono": "85682568",
  "correo": "Fernand.Gar@ejemplo.com",
  "password": "Contra564"
}
