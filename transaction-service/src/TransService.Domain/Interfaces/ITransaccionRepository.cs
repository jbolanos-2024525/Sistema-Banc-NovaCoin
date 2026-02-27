using TransService.Domain.Entities;

namespace TransService.Domain.Interfaces
{
    public interface ITransaccionRepository
    {
        Task<IEnumerable<Transaccion>> GetAllAsync();
        Task<Transaccion?> GetByIdAsync(int id);
        Task<IEnumerable<Transaccion>> GetByCuentaIdAsync(int idCuenta);
        Task<IEnumerable<Transaccion>> GetByTipoAsync(string tipo);
        Task<bool> ExisteReferenciaAsync(string referencia);
        Task AddAsync(Transaccion transaccion);
        Task UpdateAsync(Transaccion transaccion);
        Task DeleteAsync(int id);
    }
}
