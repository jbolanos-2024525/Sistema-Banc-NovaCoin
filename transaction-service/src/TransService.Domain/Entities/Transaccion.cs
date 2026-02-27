using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TransService.Domain.Entities
{
    [Table("transacciones")]
    public class Transaccion
    {
        [Key]
        [Column("id_transaccion")]
        public int IdTransaccion { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("tipo_transaccion")]
        public string TipoTransaccion { get; set; } = string.Empty;  // Deposito | Retiro | Transferencia

        [Required]
        [Column("monto", TypeName = "decimal(12,2)")]
        public decimal Monto { get; set; }

        [MaxLength(50)]
        [Column("numero_referencia")]
        public string NumeroReferencia { get; set; } = string.Empty;

        [MaxLength(200)]
        [Column("descripcion")]
        public string? Descripcion { get; set; }

        [Column("fecha_transaccion")]
        public DateTime FechaTransaccion { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("id_cuenta")]
        public int IdCuenta { get; set; }

        [Required]
        [Column("id_empleado")]
        public int IdEmpleado { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
