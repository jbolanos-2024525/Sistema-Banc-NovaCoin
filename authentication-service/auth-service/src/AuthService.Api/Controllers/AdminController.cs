using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AuthService.Api.Controllers;

/// <summary>
/// Controlador para operaciones administrativas y verificación de identidad
/// </summary>
[ApiController]
[Route("api/admin")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    /// <summary>
    /// Obtiene la información del usuario autenticado
    /// </summary>
    /// <remarks>
    /// Extrae y retorna los datos del token JWT del usuario actualmente autenticado:
    /// - **sub** → Identificador único del usuario
    /// - **username** → Nombre de usuario
    /// - **role** → Rol asignado al usuario
    ///
    /// Requiere un token JWT válido en el header Authorization.
    /// </remarks>
    /// <returns>Información del usuario autenticado</returns>
    /// <response code="200">Información retornada exitosamente</response>
    /// <response code="401">Token JWT ausente o inválido</response>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me()
    {
        var sub      = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var username = User.FindFirstValue(JwtRegisteredClaimNames.UniqueName);
        var role     = User.FindFirstValue("role");

        return Ok(new
        {
            success = true,
            sub,
            username,
            role
        });
    }

    /// <summary>
    /// Endpoint exclusivo para administradores
    /// </summary>
    /// <remarks>
    /// Solo los usuarios con el rol **ADMIN_ROLE** pueden acceder a este endpoint.
    /// Si el token es válido pero el usuario no tiene el rol requerido, se retorna 403.
    /// </remarks>
    /// <returns>Confirmación de acceso administrativo</returns>
    /// <response code="200">Acceso permitido, usuario tiene rol ADMIN_ROLE</response>
    /// <response code="401">Token JWT ausente o inválido</response>
    /// <response code="403">El usuario no tiene el rol ADMIN_ROLE</response>
    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpGet("only-admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public IActionResult OnlyAdmin()
    {
        return Ok(new { success = true, message = "Acceso permitido: ADMIN_ROLE" });
    }
}