using Microsoft.EntityFrameworkCore;

using TransService.Domain.Entities;
using TransService.Domain.Interfaces;

using TransService.Persistence.Data;

namespace TransService.Persistence.Repositories;

public class TransaccionRepository
    : ITransaccionRepository
{
    private readonly
        ApplicationDbContext
        _context;

    public TransaccionRepository(
        ApplicationDbContext context
    )
    {
        _context = context;
    }

    public async Task<IEnumerable<Transaccion>>
        GetAllAsync()
    {
        return await _context
            .Transacciones
            .OrderByDescending(
                x => x.FechaCreacion
            )
            .ToListAsync();
    }

    public async Task<Transaccion?>
        GetByIdAsync(Guid id)
    {
        return await _context
            .Transacciones
            .FirstOrDefaultAsync(
                x => x.Id == id
            );
    }

    public async Task CreateAsync(
        Transaccion transaccion
    )
    {
        await _context
            .Transacciones
            .AddAsync(transaccion);

        await _context
            .SaveChangesAsync();
    }
}