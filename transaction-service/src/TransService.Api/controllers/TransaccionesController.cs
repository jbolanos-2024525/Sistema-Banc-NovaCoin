using Microsoft.AspNetCore.Mvc;
using TransService.Application.DTOs;
using TransService.Application.Interfaces;

namespace TransService.Api.Controllers;

/// <summary>
/// Controlador para la gestión de transacciones financieras
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TransaccionesController : ControllerBase
{
    private readonly ITransaccionService _service;
    private readonly ILogger<TransaccionesController> _logger;

    /// <summary>
    /// Constructor del controlador de transacciones
    /// </summary>
    public TransaccionesController(ITransaccionService service, ILogger<TransaccionesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todas las transacciones registradas
    /// </summary>
    /// <remarks>
    /// Retorna la lista completa de transacciones sin filtros.
    /// </remarks>
    /// <returns>Lista de transacciones</returns>
    /// <response code="200">Lista retornada exitosamente</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TransaccionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    /// <summary>
    /// Obtiene una transacción por su ID
    /// </summary>
    /// <remarks>
    /// Busca y retorna una transacción específica según el ID proporcionado.
    /// </remarks>
    /// <param name="id">ID único de la transacción</param>
    /// <returns>Transacción encontrada</returns>
    /// <response code="200">Transacción encontrada exitosamente</response>
    /// <response code="404">No existe una transacción con el ID proporcionado</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TransaccionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound(new { message = $"Transacción con ID {id} no encontrada." });
        return Ok(result);
    }

    /// <summary>
    /// Obtiene todas las transacciones asociadas a una cuenta
    /// </summary>
    /// <remarks>
    /// Filtra y retorna las transacciones que pertenecen a la cuenta especificada.
    /// </remarks>
    /// <param name="idCuenta">ID único de la cuenta</param>
    /// <returns>Lista de transacciones de la cuenta</returns>
    /// <response code="200">Lista de transacciones retornada exitosamente</response>
    [HttpGet("cuenta/{idCuenta:int}")]
    [ProducesResponseType(typeof(IEnumerable<TransaccionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCuenta(int idCuenta)
    {
        var result = await _service.GetByCuentaIdAsync(idCuenta);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene transacciones filtradas por tipo
    /// </summary>
    /// <remarks>
    /// Los tipos de transacción válidos son:
    /// - **Deposito** → Ingreso de fondos a una cuenta
    /// - **Retiro** → Extracción de fondos de una cuenta
    /// - **Transferencia** → Movimiento de fondos entre cuentas
    /// </remarks>
    /// <param name="tipo">Tipo de transacción (Deposito, Retiro, Transferencia)</param>
    /// <returns>Lista de transacciones del tipo especificado</returns>
    /// <response code="200">Lista retornada exitosamente</response>
    [HttpGet("tipo/{tipo}")]
    [ProducesResponseType(typeof(IEnumerable<TransaccionDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByTipo(string tipo)
    {
        var result = await _service.GetByTipoAsync(tipo);
        return Ok(result);
    }

    /// <summary>
    /// Crea una nueva transacción
    /// </summary>
    /// <remarks>
    /// Registra una nueva transacción en el sistema. Validaciones aplicadas:
    /// - La cuenta origen debe existir y tener saldo suficiente (para Retiro y Transferencia)
    /// - El tipo de transacción debe ser válido (Deposito, Retiro, Transferencia)
    /// - El monto debe ser mayor a cero
    /// </remarks>
    /// <param name="dto">Datos de la transacción a crear</param>
    /// <returns>Transacción creada</returns>
    /// <response code="201">Transacción creada exitosamente</response>
    /// <response code="400">Datos inválidos o saldo insuficiente</response>
    [HttpPost]
    [ProducesResponseType(typeof(TransaccionDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromForm] CreateTransaccionDto dto)
    {
        try
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.IdTransaccion }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Actualiza la descripción de una transacción existente
    /// </summary>
    /// <remarks>
    /// Solo permite modificar campos editables de la transacción como la descripción.
    /// No se puede modificar el monto ni el tipo una vez creada.
    /// </remarks>
    /// <param name="id">ID único de la transacción a actualizar</param>
    /// <param name="dto">Datos a actualizar</param>
    /// <returns>Transacción actualizada</returns>
    /// <response code="200">Transacción actualizada exitosamente</response>
    /// <response code="404">No existe una transacción con el ID proporcionado</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TransaccionDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateTransaccionDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null)
            return NotFound(new { message = $"Transacción con ID {id} no encontrada." });
        return Ok(result);
    }

    /// <summary>
    /// Elimina una transacción por su ID
    /// </summary>
    /// <remarks>
    /// Elimina permanentemente la transacción del sistema. Esta acción no se puede deshacer.
    /// </remarks>
    /// <param name="id">ID único de la transacción a eliminar</param>
    /// <returns>Confirmación de eliminación</returns>
    /// <response code="200">Transacción eliminada exitosamente</response>
    /// <response code="404">No existe una transacción con el ID proporcionado</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Transacción con ID {id} no encontrada." });
        return Ok(new { message = $"Transacción {id} eliminada exitosamente." });
    }
}