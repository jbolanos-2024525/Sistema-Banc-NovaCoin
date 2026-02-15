using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces
{
    public interface ICuentaRepository
    {
        Task<IEnumerable<Cuenta>> GetByClienteAsync(int idCliente);
        Task<Cuenta?> GetByIdAsync(int id);
        Task<Cuenta?> GetByNumeroAsync(string numeroCuenta);
        Task AddAsync(Cuenta cuenta);
        Task UpdateAsync(Cuenta cuenta);
        Task DeleteAsync(int id);
    }
}