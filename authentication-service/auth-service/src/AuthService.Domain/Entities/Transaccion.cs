using System;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities
{
    [Table("transacciones")]
    public class Transaccion
    {
        [Key]
        [Column("id_transaccion")]
        public int IdTransaccion { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("tipo")]
        public string Tipo { get; set; }

        [Required]
        [Column("monto", TypeName = "decimal(12,2)")]
        public decimal Monto { get; set; }

        [Column("fecha")]
        public DateTime Fecha { get; set; } = DateTime.Now;

        [Required]
        [Column("id_cuenta_origen")]
        public int IdCuentaOrigen { get; set; }

        [ForeignKey("IdCuentaOrigen")]
        public Cuenta CuentaOrigen { get; set; }

        [Column("id_cuenta_destino")]
        public int? IdCuentaDestino { get; set; }

        [ForeignKey("IdCuentaDestino")]
        public Cuenta CuentaDestino { get; set; }
    }
}
