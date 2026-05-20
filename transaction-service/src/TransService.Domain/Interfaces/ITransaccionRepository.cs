using TransService.Domain.Entities;

namespace TransService.Domain.Interfaces;

public interface ITransaccionRepository
{
    Task<IEnumerable<Transaccion>>
        GetAllAsync();

    Task<Transaccion?>
        GetByIdAsync(Guid id);

    Task CreateAsync(
        Transaccion transaccion
    );
}