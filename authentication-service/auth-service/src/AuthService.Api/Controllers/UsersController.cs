using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers
{
    /// <summary>
    /// Controlador para gestión de usuarios
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserManagementService _userService;

        public UsersController(IUserManagementService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Actualiza el rol de un usuario (solo admin)
        /// </summary>
        [HttpPut("update-role")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<UserResponseDto>> UpdateUserRole([FromBody] UpdateUserRoleDto dto)
        {
            if (!IsAdmin())
            {
                return StatusCode(403, new { success = false, message = "Forbidden" });
            }

            var result = await _userService.UpdateUserRoleAsync(dto);
            return Ok(result);
        }

        /// <summary>
        /// Obtiene todos los usuarios (solo admin)
        /// </summary>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAllUsers()
        {
            if (!IsAdmin())
            {
                return StatusCode(403, new { success = false, message = "Forbidden" });
            }

            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        /// <summary>
        /// Obtiene un usuario por ID
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserResponseDto>> GetUserById(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
                return NotFound(new { success = false, message = "Usuario no encontrado" });

            return Ok(user);
        }

        /// <summary>
        /// Elimina un usuario (solo admin)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (!IsAdmin())
            {
                return StatusCode(403, new { success = false, message = "Forbidden" });
            }

            await _userService.DeleteUserAsync(id);

            return Ok(new
            {
                success = true,
                message = "Usuario eliminado correctamente"
            });
        }

        // 🔒 Método auxiliar para validar admin
        private bool IsAdmin()
        {
            var roleClaim = User.Claims.FirstOrDefault(c => c.Type == "role");
            return roleClaim != null && roleClaim.Value == "Admin";
        }
    }
}