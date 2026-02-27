using Microsoft.EntityFrameworkCore;
using TransService.Domain.Entities;
using TransService.Domain.Interfaces;
using TransService.Persistence.Data;

namespace TransService.Persistence.Repositories;

public class TransaccionRepository : ITransaccionRepository
{
    private readonly ApplicationDbContext _context;

    public TransaccionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Transaccion>> GetAllAsync() =>
        await _context.Transacciones.OrderByDescending(t => t.FechaTransaccion).ToListAsync();

    public async Task<Transaccion?> GetByIdAsync(int id) =>
        await _context.Transacciones.FirstOrDefaultAsync(t => t.IdTransaccion == id);

    public async Task<IEnumerable<Transaccion>> GetByCuentaIdAsync(int idCuenta) =>
        await _context.Transacciones
            .Where(t => t.IdCuenta == idCuenta)
            .OrderByDescending(t => t.FechaTransaccion)
            .ToListAsync();

    public async Task<IEnumerable<Transaccion>> GetByTipoAsync(string tipo) =>
        await _context.Transacciones
            .Where(t => t.TipoTransaccion == tipo)
            .OrderByDescending(t => t.FechaTransaccion)
            .ToListAsync();

    public async Task<bool> ExisteReferenciaAsync(string referencia) =>
        await _context.Transacciones.AnyAsync(t => t.NumeroReferencia == referencia);

    public async Task AddAsync(Transaccion transaccion)
    {
        await _context.Transacciones.AddAsync(transaccion);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Transaccion transaccion)
    {
        _context.Transacciones.Update(transaccion);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var transaccion = await _context.Transacciones.FindAsync(id);
        if (transaccion != null)
        {
            _context.Transacciones.Remove(transaccion);
            await _context.SaveChangesAsync();
        }
    }
}
