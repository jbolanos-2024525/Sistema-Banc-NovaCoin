using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

/// <summary>
/// Controlador para la autenticación y registro de usuarios
/// </summary>
[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    /// <summary>
    /// Constructor del controlador de autenticación
    /// </summary>
    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    /// <summary>
    /// Inicia sesión con credenciales de usuario
    /// </summary>
    /// <remarks>
    /// Autentica al usuario y retorna un token JWT en caso de éxito:
    /// - **username** → Nombre de usuario registrado
    /// - **password** → Contraseña del usuario
    ///
    /// El token retornado debe usarse en el header Authorization para endpoints protegidos:
    ///
    ///     Authorization: Bearer {token}
    ///
    /// </remarks>
    /// <param name="dto">Credenciales de inicio de sesión</param>
    /// <returns>Token JWT y datos del usuario autenticado</returns>
    /// <response code="200">Login exitoso, retorna el token JWT</response>
    /// <response code="401">Credenciales incorrectas</response>
    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        var result = _auth.Login(dto);
        return result.Success ? Ok(result) : Unauthorized(result);
    }

    /// <summary>
    /// Registra un nuevo usuario en el sistema
    /// </summary>
    /// <remarks>
    /// Crea una nueva cuenta de usuario. Validaciones aplicadas:
    /// - El **username** no debe estar en uso
    /// - El **email** debe tener formato válido y no estar registrado
    /// - La **password** debe cumplir con los requisitos mínimos de seguridad
    /// </remarks>
    /// <param name="dto">Datos del nuevo usuario a registrar</param>
    /// <returns>Confirmación del registro</returns>
    /// <response code="200">Usuario registrado exitosamente</response>
    /// <response code="400">Datos inválidos o usuario ya existente</response>
    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        var result = _auth.Register(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}