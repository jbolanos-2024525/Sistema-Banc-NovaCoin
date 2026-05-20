using TransService.Application.DTOs;
using TransService.Domain.Entities;

namespace TransService.Application.Interfaces;

public interface ITransaccionService
{
    Task<IEnumerable<Transaccion>>
        GetAllAsync();

    Task<Transaccion?>
        GetByIdAsync(Guid id);

    Task<Transaccion>
        CreateAsync(
            TransaccionDto dto
        );
}