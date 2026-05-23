using TransService.Application.DTOs;
using TransService.Application.Interfaces;
using TransService.Domain.Entities;
using TransService.Domain.Interfaces;

namespace TransService.Application.Services;

public class TransaccionService : ITransaccionService
{
    private readonly ITransaccionRepository _repository;

    public TransaccionService(ITransaccionRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TransaccionDto>> GetAllAsync()
    {
        var transacciones = await _repository.GetAllAsync();
        
        return transacciones.Select(t => new TransaccionDto
        {
            Id = t.Id,
            Fecha = t.FechaCreacion, 
            TipoTransaccion = t.TipoTransaccion,
            CuentaOrigen = t.CuentaOrigen, // Mapeo directo de Guid?
            CuentaDestino = t.CuentaDestino,
            Monto = t.Monto,
            Moneda = t.Moneda,
            Descripcion = t.Descripcion
        }).ToList();
    }

    public async Task<TransaccionDto?> GetByIdAsync(Guid id)
    {
        var t = await _repository.GetByIdAsync(id);
        
        if (t == null) return null;

        return new TransaccionDto
        {
            Id = t.Id,
            Fecha = t.FechaCreacion,
            TipoTransaccion = t.TipoTransaccion,
            CuentaOrigen = t.CuentaOrigen,
            CuentaDestino = t.CuentaDestino,
            Monto = t.Monto,
            Moneda = t.Moneda,
            Descripcion = t.Descripcion
        };
    }

    public async Task<TransaccionDto> CreateAsync(TransaccionDto dto)
    {
        if (dto.Monto <= 0)
        {
            throw new ArgumentException("El monto de la transacción debe ser mayor a cero.");
        }

        var nuevaTransaccion = new Transaccion
        {
            Id = Guid.NewGuid(), 
            TipoTransaccion = dto.TipoTransaccion,
            CuentaOrigen = dto.CuentaOrigen,
            CuentaDestino = dto.CuentaDestino,
            Monto = dto.Monto,
            Moneda = string.IsNullOrWhiteSpace(dto.Moneda) ? "GTQ" : dto.Moneda,
            Descripcion = dto.Descripcion,
            Estado = "COMPLETADA", 
            FechaCreacion = DateTime.UtcNow 
        };

        await _repository.CreateAsync(nuevaTransaccion);

        return new TransaccionDto
        {
            Id = nuevaTransaccion.Id,
            Fecha = nuevaTransaccion.FechaCreacion,
            TipoTransaccion = nuevaTransaccion.TipoTransaccion,
            CuentaOrigen = nuevaTransaccion.CuentaOrigen,
            CuentaDestino = nuevaTransaccion.CuentaDestino,
            Monto = nuevaTransaccion.Monto,
            Moneda = nuevaTransaccion.Moneda,
            Descripcion = nuevaTransaccion.Descripcion
        };
    }
}