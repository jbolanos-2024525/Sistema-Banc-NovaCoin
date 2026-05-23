using TransService.Application.DTOs;

namespace TransService.Application.Interfaces;

public interface ITransaccionService
{
    Task<IEnumerable<TransaccionDto>> GetAllAsync();
    Task<TransaccionDto?> GetByIdAsync(Guid id);
    Task<TransaccionDto> CreateAsync(TransaccionDto dto);
}