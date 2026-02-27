using Microsoft.AspNetCore.Mvc;
using TransService.Application.DTOs;
using TransService.Application.Interfaces;

namespace TransService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransaccionesController : ControllerBase
{
    private readonly ITransaccionService _service;
    private readonly ILogger<TransaccionesController> _logger;

    public TransaccionesController(ITransaccionService service, ILogger<TransaccionesController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>Obtiene todas las transacciones</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return Ok(result);
    }

    /// <summary>Obtiene una transacción por ID</summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null)
            return NotFound(new { message = $"Transacción con ID {id} no encontrada." });
        return Ok(result);
    }

    /// <summary>Obtiene transacciones por cuenta</summary>
    [HttpGet("cuenta/{idCuenta:int}")]
    public async Task<IActionResult> GetByCuenta(int idCuenta)
    {
        var result = await _service.GetByCuentaIdAsync(idCuenta);
        return Ok(result);
    }

    /// <summary>Obtiene transacciones por tipo (Deposito, Retiro, Transferencia)</summary>
    [HttpGet("tipo/{tipo}")]
    public async Task<IActionResult> GetByTipo(string tipo)
    {
        var result = await _service.GetByTipoAsync(tipo);
        return Ok(result);
    }

    /// <summary>Crea una nueva transacción</summary>
    [HttpPost]
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

    /// <summary>Actualiza la descripción de una transacción</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromForm] UpdateTransaccionDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);
        if (result == null)
            return NotFound(new { message = $"Transacción con ID {id} no encontrada." });
        return Ok(result);
    }

    /// <summary>Elimina una transacción</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new { message = $"Transacción con ID {id} no encontrada." });
        return Ok(new { message = $"Transacción {id} eliminada exitosamente." });
    }
}