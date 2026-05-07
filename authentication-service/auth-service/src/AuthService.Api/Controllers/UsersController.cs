using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Swashbuckle.AspNetCore.Annotations;

namespace AuthService.Api.Controllers;

/// <summary>
/// Gestión de usuarios: roles y consultas por rol.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[SwaggerTag("Operaciones de administración y consulta de usuarios")]
public class UsersController(IUserManagementService userManagementService) : ControllerBase
{
    private async Task<bool> CurrentUserIsAdmin()
    {
        var userId = User.Claims
            .FirstOrDefault(c => c.Type == "sub" ||
                c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

        if (string.IsNullOrEmpty(userId)) return false;

        var roles = await userManagementService.GetUserRolesAsync(userId);
        return roles.Contains(RoleConstants.ADMIN_ROLE);
    }

    /// <summary>
    /// Actualiza el rol de un usuario.
    /// </summary>
    /// <remarks>
    /// Solo accesible por usuarios con rol <b>Admin</b>.
    ///
    /// Ejemplo de body:
    /// <code>
    /// {
    ///   "roleName": "Manager"
    /// }
    /// </code>
    /// </remarks>
    /// <param name="userId">ID del usuario cuyo rol se desea actualizar.</param>
    /// <param name="dto">Objeto con el nombre del nuevo rol.</param>
    /// <returns>El usuario actualizado con su nueva información de rol.</returns>
    [HttpPut("{userId}/role")]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    [SwaggerOperation(
        Summary = "Actualizar rol de usuario",
        Description = "Permite a un administrador cambiar el rol de cualquier usuario registrado.",
        OperationId = "UpdateUserRole",
        Tags = new [] { "Users" }
    )]
    [SwaggerResponse(200, "Rol actualizado exitosamente.", typeof(UserResponseDto))]
    [SwaggerResponse(400, "Solicitud inválida o datos incorrectos.")]
    [SwaggerResponse(401, "No autenticado. Se requiere un token JWT válido.")]
    [SwaggerResponse(403, "Acceso denegado. El usuario actual no tiene rol Admin.")]
    [SwaggerResponse(404, "Usuario no encontrado.")]
    [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
    public async Task<ActionResult<UserResponseDto>> UpdateUserRole(
        [SwaggerParameter("ID del usuario a modificar.", Required = true)] string userId,
        [FromBody] UpdateUserRoleDto dto)
    {
        if (!await CurrentUserIsAdmin())
            return StatusCode(403, new { success = false, message = "Forbidden" });

        var result = await userManagementService.UpdateUserRoleAsync(userId, dto.RoleName);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene los roles asignados a un usuario.
    /// </summary>
    /// <remarks>
    /// Cualquier usuario autenticado puede consultar los roles de un usuario por su ID.
    /// </remarks>
    /// <param name="userId">ID del usuario a consultar.</param>
    /// <returns>Lista de nombres de roles asignados al usuario.</returns>
    [HttpGet("{userId}/roles")]
    [Authorize]
    [SwaggerOperation(
        Summary = "Obtener roles de un usuario",
        Description = "Retorna la lista de roles asignados a un usuario específico.",
        OperationId = "GetUserRoles",
        Tags = new [] { "Users" }
    )]
    [SwaggerResponse(200, "Lista de roles obtenida exitosamente.", typeof(IReadOnlyList<string>))]
    [SwaggerResponse(401, "No autenticado. Se requiere un token JWT válido.")]
    [SwaggerResponse(404, "Usuario no encontrado.")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetUserRoles(
        [SwaggerParameter("ID del usuario a consultar.", Required = true)] string userId)
    {
        var roles = await userManagementService.GetUserRolesAsync(userId);
        return Ok(roles);
    }

    /// <summary>
    /// Obtiene todos los usuarios que pertenecen a un rol específico.
    /// </summary>
    /// <remarks>
    /// Solo accesible por usuarios con rol <b>Admin</b>.
    ///
    /// Roles disponibles de ejemplo: <c>Admin</c>, <c>Manager</c>, <c>User</c>.
    /// </remarks>
    /// <param name="roleName">Nombre del rol por el cual filtrar usuarios.</param>
    /// <returns>Lista de usuarios que poseen el rol indicado.</returns>
    [HttpGet("by-role/{roleName}")]
    [Authorize]
    [EnableRateLimiting("ApiPolicy")]
    [SwaggerOperation(
        Summary = "Obtener usuarios por rol",
        Description = "Retorna todos los usuarios que tienen asignado el rol especificado. Requiere rol Admin.",
        OperationId = "GetUsersByRole",
        Tags = new [] { "Users" }
    )]
    [SwaggerResponse(200, "Lista de usuarios obtenida exitosamente.", typeof(IReadOnlyList<UserResponseDto>))]
    [SwaggerResponse(401, "No autenticado. Se requiere un token JWT válido.")]
    [SwaggerResponse(403, "Acceso denegado. El usuario actual no tiene rol Admin.")]
    [SwaggerResponse(404, "Rol no encontrado o sin usuarios asignados.")]
    [SwaggerResponse(429, "Demasiadas solicitudes. Límite de tasa excedido.")]
    public async Task<ActionResult<IReadOnlyList<UserResponseDto>>> GetUsersByRole(
        [SwaggerParameter("Nombre del rol a filtrar.", Required = true)] string roleName)
    {
        if (!await CurrentUserIsAdmin())
            return StatusCode(403, new { success = false, message = "Forbidden" });

        var users = await userManagementService.GetUsersByRoleAsync(roleName);
        return Ok(users);
    }
}