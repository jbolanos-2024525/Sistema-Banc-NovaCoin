using System;
using System.ComponentModel.DataAnnotations;

namespace AuthService.Domain.Entities
{
    public class Cliente
    {
        [Key]
        public int IdCliente { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [MaxLength(50, ErrorMessage = "El apellido no puede exceder los 50 caracteres.")]
        public string Apellido { get; set; } = string.Empty;

        [Required(ErrorMessage = "El DPI es obligatorio.")]
        [MaxLength(20, ErrorMessage = "El DPI no puede exceder los 20 caracteres.")]
        public string Dpi { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Direccion { get; set; } = string.Empty;

        [MaxLength(15)]
        public string Telefono { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Correo { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}