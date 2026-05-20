using TransService.Domain.Enums;

namespace TransService.Domain.Entities;

public class Transaccion
{
    public Guid Id { get; set; }

    public TipoTransaccion TipoTransaccion { get; set; }

    public Guid? CuentaOrigen { get; set; }

    public Guid? CuentaDestino { get; set; }

    public decimal Monto { get; set; }

    public string Moneda { get; set; } = "GTQ";

    public string Descripcion { get; set; } = string.Empty;

    public string Estado { get; set; } = "COMPLETADA";

    public DateTime FechaCreacion { get; set; }
        = DateTime.UtcNow;
}