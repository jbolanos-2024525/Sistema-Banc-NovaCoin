using TransService.Domain.Enums;

namespace TransService.Application.DTOs;

public class TransaccionDto
{
    public TipoTransaccion
        TipoTransaccion { get; set; }

    public Guid?
        CuentaOrigen { get; set; }

    public Guid?
        CuentaDestino { get; set; }

    public decimal
        Monto { get; set; }

    public string
        Moneda { get; set; } = "GTQ";

    public string
        Descripcion { get; set; }
            = string.Empty;
}