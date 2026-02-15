using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities
{
    public class Cuenta
    {
        [Key]
        public int IdCuenta { get; set; }

        [Required]
        [MaxLength(20)]
        public string NumeroCuenta { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string TipoCuenta { get; set; } = string.Empty;

        [Column(TypeName = "decimal(12,2)")]
        public decimal Saldo { get; set; }

        public DateTime FechaApertura { get; set; } = DateTime.UtcNow;

        [ForeignKey("Cliente")]
        public int IdCliente { get; set; }

        public Cliente? Cliente { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}