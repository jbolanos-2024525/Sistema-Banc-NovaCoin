using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Swashbuckle.AspNetCore.Annotations;

namespace AuthService.Api.Controllers
{
    /// <summary>
    /// Autenticación, registro y gestión de perfil de usuarios.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    [SwaggerTag("Operaciones de autenticación, registro y gestión de sesión")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserManagementService _userManagementService;
        private readonly IRefreshTokenService _refreshTokenService;

        public AuthController(
            IAuthService authService,
            IUserManagementService userManagementService,
            IRefreshTokenService refreshTokenService)
        {
            _authService = authService;
            _userManagementService = userManagementService;
            _refreshTokenService = refreshTokenService;
        }

        private async Task<bool> CurrentUserIsAdmin()
        {
            var userId = User.Claims
                .FirstOrDefault(c => c.Type == "sub" ||
                    c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

            if (string.IsNullOrEmpty(userId)) return false;
            var roles = await _userManagementService.GetUserRolesAsync(userId);
            return roles.Contains(RoleConstants.ADMIN_ROLE);
        }

        // ──────────────────────────────────────────────
        // SESIÓN
        // ──────────────────────────────────────────────

        /// <summary>
        /// Rota el refresh token y devuelve un nuevo par de tokens.
        /// </summary>
        /// <remarks>
        /// No requiere autenticación. Envía el refresh token vigente para obtener
        /// un nuevo <c>accessToken</c> y un nuevo <c>refreshToken</c>.
        ///
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "refreshToken": "eyJhbGciOi..."
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("refresh")]
        [AllowAnonymous]
        [SwaggerOperation(
            Summary = "Rotar refresh token",
            Description = "Invalida el refresh token actual y emite un nuevo par de tokens (access + refresh).",
            OperationId = "RefreshToken",
            Tags = new [] { "Auth - Sesión" }
        )]
        [SwaggerResponse(200, "Tokens renovados exitosamente.", typeof(AuthResponseDto))]
        [SwaggerResponse(400, "Refresh token inválido o malformado.")]
        [SwaggerResponse(401, "Refresh token expirado o revocado.")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
        {
            var result = await _refreshTokenService.RotateAsync(dto.RefreshToken);
            return Ok(result);
        }

        /// <summary>
        /// Cierra la sesión del usuario revocando su refresh token.
        /// </summary>
        /// <remarks>
        /// Requiere un JWT válido en el header <c>Authorization: Bearer &lt;token&gt;</c>.
        ///
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "refreshToken": "eyJhbGciOi..."
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("logout")]
        [Authorize]
        [SwaggerOperation(
            Summary = "Cerrar sesión",
            Description = "Revoca el refresh token del usuario, invalidando la sesión actual.",
            OperationId = "Logout",
            Tags = new [] { "Auth - Sesión" }
        )]
        [SwaggerResponse(200, "Sesión cerrada exitosamente.")]
        [SwaggerResponse(401, "No autenticado. Se requiere un token JWT válido.")]
        public async Task<IActionResult> Logout([FromBody] RefreshRequestDto dto)
        {
            await _refreshTokenService.RevokeAsync(dto.RefreshToken);
            return Ok(new { message = "Sesión cerrada" });
        }

        // ──────────────────────────────────────────────
        // PERFIL
        // ──────────────────────────────────────────────

        /// <summary>
        /// Obtiene el perfil del usuario autenticado.
        /// </summary>
        /// <remarks>
        /// El ID del usuario se extrae automáticamente del claim <c>sub</c> del JWT.
        /// No requiere parámetros adicionales.
        /// </remarks>
        [HttpGet("profile")]
        [Authorize]
        [SwaggerOperation(
            Summary = "Obtener perfil propio",
            Description = "Retorna los datos del usuario actualmente autenticado.",
            OperationId = "GetProfile",
            Tags = new [] { "Auth - Perfil" }
        )]
        [SwaggerResponse(200, "Perfil obtenido exitosamente.", typeof(UserResponseDto))]
        [SwaggerResponse(401, "No autenticado. Se requiere un token JWT válido.")]
        [SwaggerResponse(404, "Usuario no encontrado.")]
        public async Task<ActionResult<object>> GetProfile()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == "sub" ||
                c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userIdClaim.Value);
            if (user == null) return NotFound();

            return Ok(new { success = true, message = "Perfil obtenido exitosamente", data = user });
        }

        /// <summary>
        /// Obtiene el perfil de un usuario por su ID.
        /// </summary>
        /// <remarks>
        /// Endpoint público (sin autenticación requerida). Útil para servicios internos
        /// que necesiten consultar datos de usuario por ID.
        ///
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "userId": "abc123"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("profile/by-id")]
        [EnableRateLimiting("ApiPolicy")]
        [SwaggerOperation(
            Summary = "Obtener perfil por ID",
            Description = "Retorna los datos de cualquier usuario dado su ID. No requiere autenticación.",
            OperationId = "GetProfileById",
            Tags = new [] { "Auth - Perfil" }
        )]
        [SwaggerResponse(200, "Perfil obtenido exitosamente.", typeof(UserResponseDto))]
        [SwaggerResponse(400, "El campo userId es requerido.")]
        [SwaggerResponse(404, "Usuario no encontrado.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        public async Task<ActionResult<object>> GetProfileById([FromBody] GetProfileByIdDto request)
        {
            if (string.IsNullOrEmpty(request.UserId))
                return BadRequest(new { success = false, message = "El userId es requerido" });

            var user = await _authService.GetUserByIdAsync(request.UserId);
            if (user == null)
                return NotFound(new { success = false, message = "Usuario no encontrado" });

            return Ok(new { success = true, message = "Perfil obtenido exitosamente", data = user });
        }

        // ──────────────────────────────────────────────
        // REGISTRO Y LOGIN
        // ──────────────────────────────────────────────

        /// <summary>
        /// Registra un nuevo usuario en el sistema.
        /// </summary>
        /// <remarks>
        /// Acepta <c>multipart/form-data</c> con un límite de <b>10 MB</b>.
        /// Puede incluir una imagen de perfil junto con los datos del usuario.
        ///
        /// Campos requeridos: <c>email</c>, <c>password</c>, <c>firstName</c>, <c>lastName</c>.
        /// </remarks>
        [HttpPost("register")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [EnableRateLimiting("AuthPolicy")]
        [Consumes("multipart/form-data")]
        [SwaggerOperation(
            Summary = "Registrar usuario",
            Description = "Crea una nueva cuenta de usuario. Envía un correo de verificación al email proporcionado.",
            OperationId = "Register",
            Tags = new [] { "Auth - Registro y Login" }
        )]
        [SwaggerResponse(201, "Usuario registrado exitosamente.", typeof(RegisterResponseDto))]
        [SwaggerResponse(400, "Datos de registro inválidos o email ya en uso.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            return StatusCode(201, result);
        }

        /// <summary>
        /// Inicia sesión con email y contraseña.
        /// </summary>
        /// <remarks>
        /// Retorna un <c>accessToken</c> JWT y un <c>refreshToken</c> de rotación.
        ///
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "email": "usuario@ejemplo.com",
        ///   "password": "MiContraseña123!"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("login")]
        [IgnoreAntiforgeryToken]
        [EnableRateLimiting("AuthPolicy")]
        [SwaggerOperation(
            Summary = "Iniciar sesión",
            Description = "Autentica al usuario y retorna un par de tokens JWT (access + refresh).",
            OperationId = "Login",
            Tags = new [] { "Auth - Registro y Login" }
        )]
        [SwaggerResponse(200, "Autenticación exitosa.", typeof(AuthResponseDto))]
        [SwaggerResponse(400, "Credenciales con formato inválido.")]
        [SwaggerResponse(401, "Email o contraseña incorrectos.")]
        [SwaggerResponse(403, "Cuenta no verificada o deshabilitada.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }

        // ──────────────────────────────────────────────
        // VERIFICACIÓN DE EMAIL
        // ──────────────────────────────────────────────

        /// <summary>
        /// Verifica el email del usuario con el token recibido por correo.
        /// </summary>
        /// <remarks>
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "token": "abc123...",
        ///   "email": "usuario@ejemplo.com"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("verify-email")]
        [EnableRateLimiting("ApiPolicy")]
        [SwaggerOperation(
            Summary = "Verificar email",
            Description = "Activa la cuenta del usuario usando el token de verificación enviado por correo.",
            OperationId = "VerifyEmail",
            Tags = new [] { "Auth - Email" }
        )]
        [SwaggerResponse(200, "Email verificado exitosamente.", typeof(EmailResponseDto))]
        [SwaggerResponse(400, "Token de verificación inválido o expirado.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
        {
            var result = await _authService.VerifyEmailAsync(verifyEmailDto);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Reenvía el correo de verificación de cuenta.
        /// </summary>
        /// <remarks>
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "email": "usuario@ejemplo.com"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("resend-verification")]
        [EnableRateLimiting("AuthPolicy")]
        [SwaggerOperation(
            Summary = "Reenviar verificación de email",
            Description = "Genera y envía un nuevo token de verificación al email indicado.",
            OperationId = "ResendVerification",
            Tags = new [] { "Auth - Email" }
        )]
        [SwaggerResponse(200, "Correo de verificación reenviado exitosamente.", typeof(EmailResponseDto))]
        [SwaggerResponse(400, "El email ya fue verificado previamente.")]
        [SwaggerResponse(404, "No existe un usuario con ese email.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        [SwaggerResponse(503, "Error al enviar el correo. Servicio de email no disponible.")]
        public async Task<ActionResult<EmailResponseDto>> ResendVerification([FromBody] ResendVerificationDto resendDto)
        {
            var result = await _authService.ResendVerificationEmailAsync(resendDto);

            if (!result.Success)
            {
                if (result.Message.Contains("no encontrado", StringComparison.OrdinalIgnoreCase))
                    return NotFound(result);

                if (result.Message.Contains("ya ha sido verificado", StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Contains("ya verificado", StringComparison.OrdinalIgnoreCase))
                    return BadRequest(result);

                return StatusCode(503, result);
            }

            return Ok(result);
        }

        // ──────────────────────────────────────────────
        // RECUPERACIÓN DE CONTRASEÑA
        // ──────────────────────────────────────────────

        /// <summary>
        /// Solicita el restablecimiento de contraseña mediante email.
        /// </summary>
        /// <remarks>
        /// Por seguridad, siempre retorna éxito aunque el email no exista en el sistema,
        /// evitando así la enumeración de usuarios.
        ///
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "email": "usuario@ejemplo.com"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("forgot-password")]
        [EnableRateLimiting("AuthPolicy")]
        [SwaggerOperation(
            Summary = "Solicitar restablecimiento de contraseña",
            Description = "Envía un correo con un enlace para restablecer la contraseña. Siempre responde con éxito por razones de seguridad.",
            OperationId = "ForgotPassword",
            Tags = new [] { "Auth - Contraseña" }
        )]
        [SwaggerResponse(200, "Solicitud procesada. Si el email existe, recibirá un correo.", typeof(EmailResponseDto))]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        [SwaggerResponse(503, "Error al enviar el correo. Servicio de email no disponible.")]
        public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

            if (!result.Success)
                return StatusCode(503, result);

            return Ok(result);
        }

        /// <summary>
        /// Restablece la contraseña usando el token recibido por email.
        /// </summary>
        /// <remarks>
        /// Ejemplo de body:
        /// <code>
        /// {
        ///   "email": "usuario@ejemplo.com",
        ///   "token": "abc123...",
        ///   "newPassword": "NuevaContraseña123!"
        /// }
        /// </code>
        /// </remarks>
        [HttpPost("reset-password")]
        [EnableRateLimiting("AuthPolicy")]
        [SwaggerOperation(
            Summary = "Restablecer contraseña",
            Description = "Establece una nueva contraseña usando el token de restablecimiento enviado por correo.",
            OperationId = "ResetPassword",
            Tags = new [] { "Auth - Contraseña" }
        )]
        [SwaggerResponse(200, "Contraseña restablecida exitosamente.", typeof(EmailResponseDto))]
        [SwaggerResponse(400, "Token inválido, expirado o contraseña no cumple los requisitos.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var result = await _authService.ResetPasswordAsync(resetPasswordDto);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        // ──────────────────────────────────────────────
        // ADMINISTRACIÓN
        // ──────────────────────────────────────────────

        /// <summary>
        /// Obtiene la lista completa de usuarios registrados.
        /// </summary>
        /// <remarks>
        /// Solo accesible por usuarios con rol <b>Admin</b>.
        /// </remarks>
        [HttpGet("users")]
        [Authorize]
        [EnableRateLimiting("AuthPolicy")]
        [SwaggerOperation(
            Summary = "Listar todos los usuarios",
            Description = "Retorna todos los usuarios del sistema. Requiere rol Admin.",
            OperationId = "GetAllUsers",
            Tags = new [] { "Auth - Administración" }
        )]
        [SwaggerResponse(200, "Lista de usuarios obtenida exitosamente.", typeof(IEnumerable<UserResponseDto>))]
        [SwaggerResponse(401, "No autenticado. Se requiere un token JWT válido.")]
        [SwaggerResponse(403, "Acceso denegado. El usuario actual no tiene rol Admin.")]
        [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            if (!await CurrentUserIsAdmin())
                return StatusCode(403, new { success = false, message = "Forbidden" });

            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}