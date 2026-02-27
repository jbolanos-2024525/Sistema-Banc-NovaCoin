namespace TransService.Application.DTOs
{
    public class CreateTransaccionDto
    {
        public string TipoTransaccion { get; set; } = string.Empty;  // Deposito | Retiro | Transferencia
        public decimal Monto { get; set; }
        public string NumeroReferencia { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdCuenta { get; set; }
        public int IdEmpleado { get; set; }
    }

    public class UpdateTransaccionDto
    {
        public string? Descripcion { get; set; }
    }

    public class TransaccionResponseDto
    {
        public int IdTransaccion { get; set; }
        public string TipoTransaccion { get; set; } = string.Empty;
        public decimal Monto { get; set; }
        public string NumeroReferencia { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public DateTime FechaTransaccion { get; set; }
        public int IdCuenta { get; set; }
        public int IdEmpleado { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
