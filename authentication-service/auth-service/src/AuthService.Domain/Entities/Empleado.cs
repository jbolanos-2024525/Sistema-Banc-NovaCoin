using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthService.Domain.Entities
{
    [Table("empleados")]
    public class Empleado
    {
        [Key]
        [Column("id_empleado")]
        public int IdEmpleado { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("nombre")]
        public string Nombre { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("apellido")]
        public string Apellido { get; set; }

        [Required]
        [MaxLength(30)]
        [Column("cargo")]
        public string Cargo { get; set; }

        [MaxLength(15)]
        [Column("telefono")]
        public string Telefono { get; set; }

        [MaxLength(50)]
        [Column("correo")]
        public string Correo { get; set; }
    }
}
