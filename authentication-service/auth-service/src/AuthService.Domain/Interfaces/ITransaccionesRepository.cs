using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces
{
    public interface ITransaccionRepository
    {
        Task<IEnumerable<Transaccion>> GetAllAsync();
        Task<Transaccion?> GetByIdAsync(int id);
        Task<IEnumerable<Transaccion>> GetByCuentaIdAsync(int cuentaId);
        Task AddAsync(Transaccion transaccion);
        Task UpdateAsync(Transaccion transaccion);
        Task DeleteAsync(int id);
    }
}
