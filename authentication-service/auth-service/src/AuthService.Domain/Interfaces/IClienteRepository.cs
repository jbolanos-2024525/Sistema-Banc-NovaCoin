using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces
{
    public interface IClienteRepository
    {
        Task<IEnumerable<Cliente>> GetAllAsync();
        Task<Cliente?> GetByIdAsync(int id);
        Task<Cliente?> GetByDpiAsync(string dpi);
        Task AddAsync(Cliente cliente);
        Task UpdateAsync(Cliente cliente);
        Task DeleteAsync(int id);
    }
}