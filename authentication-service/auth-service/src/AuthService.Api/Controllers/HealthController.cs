using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

/// <summary>
/// Controlador para verificar la disponibilidad del servicio
/// </summary>
[ApiController]
[Route("api/health")]
[Produces("application/json")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Verifica si el servicio de autenticación está activo
    /// </summary>
    /// <remarks>
    /// Endpoint público que no requiere autenticación.
    /// Útil para health checks de balanceadores de carga o monitoreo.
    /// </remarks>
    /// <returns>Estado actual del servicio</returns>
    /// <response code="200">Servicio activo y funcionando correctamente</response>
    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Get() => Ok(new { success = true, status = "ok" });
}