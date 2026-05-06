using System;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using AuthService.Domain.Constants;

namespace AuthService.Api.Controllers
{
    /// <summary>
    /// Controlador de autenticación y gestión de usuarios
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IRefreshTokenService _refreshTokenService;

        public AuthController(
            IAuthService authService,
            IRefreshTokenService refreshTokenService)
        {
            _authService = authService;
            _refreshTokenService = refreshTokenService;
        }

        /// <summary>
        /// Refresca el token de acceso usando un refresh token
        /// </summary>
        [HttpPost("refresh")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
        {
            var result = await _refreshTokenService.RotateAsync(dto.RefreshToken);
            return Ok(result);
        }

        /// <summary>
        /// Cierra sesión del usuario
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout([FromBody] RefreshRequestDto dto)
        {
            await _refreshTokenService.RevokeAsync(dto.RefreshToken);
            return Ok(new { message = "Sesión cerrada" });
        }

        /// <summary>
        /// Obtiene el perfil del usuario autenticado
        /// </summary>
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<object>> GetProfile()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == "sub" ||
                c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
                return Unauthorized();

            var user = await _authService.GetUserByIdAsync(userIdClaim.Value);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                success = true,
                message = "Perfil obtenido exitosamente",
                data = user
            });
        }

        /// <summary>
        /// Obtiene el perfil de un usuario por ID
        /// </summary>
        [HttpPost("profile/by-id")]
        public async Task<ActionResult<object>> GetProfileById([FromBody] GetProfileByIdDto request)
        {
            if (string.IsNullOrEmpty(request.UserId))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "El userId es requerido"
                });
            }

            var user = await _authService.GetUserByIdAsync(request.UserId);

            if (user == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Usuario no encontrado"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Perfil obtenido exitosamente",
                data = user
            });
        }

        /// <summary>
        /// Registra un nuevo usuario
        /// </summary>
        [HttpPost("register")]
        public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
        {
            var result = await _authService.RegisterAsync(registerDto);
            return StatusCode(StatusCodes.Status201Created, result);
        }

        /// <summary>
        /// Inicia sesión de usuario
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }

        /// <summary>
        /// Verifica el email del usuario
        /// </summary>
        [HttpPost("verify-email")] // ✔ corregido typo
        public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
        {
            var result = await _authService.VerifyEmailAsync(verifyEmailDto);
            return Ok(result);
        }

        /// <summary>
        /// Reenvía el email de verificación
        /// </summary>
        [HttpPost("resend-verification")]
        public async Task<ActionResult<EmailResponseDto>> ResendVerification([FromBody] ResendVerificationDto resendDto)
        {
            var result = await _authService.ResendVerificationEmailAsync(resendDto);

            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

        /// <summary>
        /// Solicita recuperación de contraseña
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var result = await _authService.ForgotPasswordAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Restablece la contraseña del usuario
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var result = await _authService.ResetPasswordAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Obtiene todos los usuarios (solo admin)
        /// </summary>
        [HttpGet("users")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            if (!await CurrentUserIsAdmin())
            {
                return StatusCode(403, new { success = false, message = "Forbidden" });
            }

            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        // 🔒 Método auxiliar
        private async Task<bool> CurrentUserIsAdmin()
        {
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == "role");
            return roleClaim != null && roleClaim.Value == "Admin";
        }
    }
}