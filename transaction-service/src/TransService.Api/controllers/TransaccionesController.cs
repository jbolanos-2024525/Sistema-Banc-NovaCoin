using Microsoft.AspNetCore.Mvc;

using TransService.Application.DTOs;
using TransService.Application.Interfaces;

namespace TransService.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransaccionesController
    : ControllerBase
{
    private readonly
        ITransaccionService
        _service;

    public TransaccionesController(
        ITransaccionService service
    )
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult>
        GetAll()
    {
        var transacciones =
            await _service.GetAllAsync();

        return Ok(transacciones);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult>
        GetById(Guid id)
    {
        var transaccion =
            await _service.GetByIdAsync(id);

        if (transaccion == null)
        {
            return NotFound(new
            {
                message =
                    "Transacción no encontrada"
            });
        }

        return Ok(transaccion);
    }

    [HttpPost]
    public async Task<IActionResult>
        Create(
            [FromBody]
            TransaccionDto dto
        )
    {
        var transaccion =
            await _service.CreateAsync(dto);

        return Ok(new
        {
            success = true,
            transaccion
        });
    }
}