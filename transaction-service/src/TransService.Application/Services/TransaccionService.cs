using TransService.Application.DTOs;
using TransService.Application.Interfaces;

using TransService.Domain.Entities;
using TransService.Domain.Interfaces;

namespace TransService.Application.Services;

public class TransaccionService
    : ITransaccionService
{
    private readonly
        ITransaccionRepository
        _repository;

    public TransaccionService(
        ITransaccionRepository repository
    )
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Transaccion>>
        GetAllAsync()
    {
        return await _repository
            .GetAllAsync();
    }

    public async Task<Transaccion?>
        GetByIdAsync(Guid id)
    {
        return await _repository
            .GetByIdAsync(id);
    }

    public async Task<Transaccion>
        CreateAsync(
            TransaccionDto dto
        )
    {
        var transaccion =
            new Transaccion
            {
                TipoTransaccion =
                    dto.TipoTransaccion,

                CuentaOrigen =
                    dto.CuentaOrigen,

                CuentaDestino =
                    dto.CuentaDestino,

                Monto = dto.Monto,

                Moneda = dto.Moneda,

                Descripcion =
                    dto.Descripcion
            };

        await _repository
            .CreateAsync(transaccion);

        return transaccion;
    }
}