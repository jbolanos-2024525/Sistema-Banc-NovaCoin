using Microsoft.AspNetCore.Mvc;
using TransService.Application.DTOs;
using TransService.Application.Interfaces;

namespace TransService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransaccionesController : ControllerBase
{
    private readonly ITransaccionService _service;

    public TransaccionesController(ITransaccionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // El servicio debe devolver los DTOs incluyendo el campo de la fecha (ej. Fecha o CreatedAt)
        var transacciones = await _service.GetAllAsync();
        return Ok(transacciones);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var transaccion = await _service.GetByIdAsync(id);

        if (transaccion == null)
        {
            return NotFound(new
            {
                message = "Transacción no encontrada"
            });
        }

        return Ok(transaccion);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TransaccionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var transaccion = await _service.CreateAsync(dto);

            // Retorna un HTTP 201 Created y añade la cabecera 'Location' automáticamente.
            return CreatedAtAction(nameof(GetById), new { id = transaccion.Id }, new
            {
                success = true,
                transaccion
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}