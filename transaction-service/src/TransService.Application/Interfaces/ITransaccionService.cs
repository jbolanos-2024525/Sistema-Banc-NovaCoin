using TransService.Application.DTOs;

namespace TransService.Application.Interfaces
{
    public interface ITransaccionService
    {
        Task<IEnumerable<TransaccionResponseDto>> GetAllAsync();
        Task<TransaccionResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<TransaccionResponseDto>> GetByCuentaIdAsync(int idCuenta);
        Task<IEnumerable<TransaccionResponseDto>> GetByTipoAsync(string tipo);
        Task<TransaccionResponseDto> CreateAsync(CreateTransaccionDto dto);
        Task<TransaccionResponseDto?> UpdateAsync(int id, UpdateTransaccionDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
