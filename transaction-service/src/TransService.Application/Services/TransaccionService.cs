using TransService.Application.DTOs;
using TransService.Application.Interfaces;
using TransService.Domain.Entities;
using TransService.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace TransService.Application.Services
{
    public class TransaccionService : ITransaccionService
    {
        private readonly ITransaccionRepository _repository;
        private readonly ILogger<TransaccionService> _logger;

        public TransaccionService(ITransaccionRepository repository, ILogger<TransaccionService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task<IEnumerable<TransaccionResponseDto>> GetAllAsync()
        {
            var transacciones = await _repository.GetAllAsync();
            return transacciones.Select(MapToResponseDto);
        }

        public async Task<TransaccionResponseDto?> GetByIdAsync(int id)
        {
            var transaccion = await _repository.GetByIdAsync(id);
            return transaccion == null ? null : MapToResponseDto(transaccion);
        }

        public async Task<IEnumerable<TransaccionResponseDto>> GetByCuentaIdAsync(int idCuenta)
        {
            var transacciones = await _repository.GetByCuentaIdAsync(idCuenta);
            return transacciones.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<TransaccionResponseDto>> GetByTipoAsync(string tipo)
        {
            var transacciones = await _repository.GetByTipoAsync(tipo);
            return transacciones.Select(MapToResponseDto);
        }

        public async Task<TransaccionResponseDto> CreateAsync(CreateTransaccionDto dto)
        {
            // Validar referencia única
            if (await _repository.ExisteReferenciaAsync(dto.NumeroReferencia))
                throw new InvalidOperationException($"El número de referencia '{dto.NumeroReferencia}' ya existe.");

            // Validar tipo de transacción
            var tiposValidos = new[] { "Deposito", "Retiro", "Transferencia" };
            if (!tiposValidos.Contains(dto.TipoTransaccion))
                throw new ArgumentException($"TipoTransaccion debe ser: {string.Join(", ", tiposValidos)}");

            if (dto.Monto <= 0)
                throw new ArgumentException("El monto debe ser mayor a cero.");

            var transaccion = new Transaccion
            {
                TipoTransaccion  = dto.TipoTransaccion,
                Monto            = dto.Monto,
                NumeroReferencia = dto.NumeroReferencia,
                Descripcion      = dto.Descripcion,
                FechaTransaccion = DateTime.UtcNow,
                IdCuenta         = dto.IdCuenta,
                IdEmpleado       = dto.IdEmpleado
            };

            await _repository.AddAsync(transaccion);
            _logger.LogInformation("Transaccion creada: {Id} - {Tipo} - {Monto}", transaccion.IdTransaccion, transaccion.TipoTransaccion, transaccion.Monto);

            return MapToResponseDto(transaccion);
        }

        public async Task<TransaccionResponseDto?> UpdateAsync(int id, UpdateTransaccionDto dto)
        {
            var transaccion = await _repository.GetByIdAsync(id);
            if (transaccion == null) return null;

            transaccion.Descripcion = dto.Descripcion;

            await _repository.UpdateAsync(transaccion);
            _logger.LogInformation("Transaccion actualizada: {Id}", id);

            return MapToResponseDto(transaccion);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var transaccion = await _repository.GetByIdAsync(id);
            if (transaccion == null) return false;

            await _repository.DeleteAsync(id);
            _logger.LogInformation("Transaccion eliminada: {Id}", id);
            return true;
        }

        private static TransaccionResponseDto MapToResponseDto(Transaccion t) => new()
        {
            IdTransaccion    = t.IdTransaccion,
            TipoTransaccion  = t.TipoTransaccion,
            Monto            = t.Monto,
            NumeroReferencia = t.NumeroReferencia,
            Descripcion      = t.Descripcion,
            FechaTransaccion = t.FechaTransaccion,
            IdCuenta         = t.IdCuenta,
            IdEmpleado       = t.IdEmpleado,
            CreatedAt        = t.CreatedAt,
            UpdatedAt        = t.UpdatedAt
        };
    }
}
