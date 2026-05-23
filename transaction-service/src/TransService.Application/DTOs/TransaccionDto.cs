using System.ComponentModel.DataAnnotations;
using TransService.Domain.Enums;

namespace TransService.Application.DTOs;

public class TransaccionDto
{
    public Guid Id { get; set; }

    public DateTime Fecha { get; set; }

    [Required(ErrorMessage = "El tipo de transacción es obligatorio.")]
    public TipoTransaccion TipoTransaccion { get; set; }

    // 🔄 Restaurados a Guid? para la consistencia original
    public Guid? CuentaOrigen { get; set; }

    public Guid? CuentaDestino { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "El monto debe ser mayor a cero.")]
    public decimal Monto { get; set; }

    [StringLength(10)]
    public string Moneda { get; set; } = "GTQ";

    [StringLength(250, ErrorMessage = "La descripción no puede exceder los 250 caracteres.")]
    public string Descripcion { get; set; } = string.Empty;
}