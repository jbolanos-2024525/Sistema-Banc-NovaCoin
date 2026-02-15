using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities
{
    [Table("prestamos")]
    public class Prestamo
    {
        [Key]
        [Column("id_prestamo")]
        public int IdPrestamo { get; set; }

        [Required]
        [Column("monto", TypeName = "decimal(12,2)")]
        public decimal Monto { get; set; }

        [Required]
        [Column("interes", TypeName = "decimal(5,2)")]
        public decimal Interes { get; set; }

        [Required]
        [Column("plazo")]
        public int Plazo { get; set; }

        [Column("fecha_solicitud")]
        public DateTime FechaSolicitud { get; set; } = DateTime.Now;

        [Required]
        [Column("id_cliente")]
        public int IdCliente { get; set; }

        [ForeignKey("IdCliente")]
        public Cliente Cliente { get; set; }
    }
}