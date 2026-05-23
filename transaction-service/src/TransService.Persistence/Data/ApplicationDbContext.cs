using Microsoft.EntityFrameworkCore;
using TransService.Domain.Entities;

namespace TransService.Persistence.Data;

public class ApplicationDbContext
    : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext>
            options
    ) : base(options)
    {
    }

    public DbSet<Transaccion>
        Transacciones { get; set; }
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Transaccion>(entity =>
    {
        entity.ToTable("transacciones");

        entity.HasKey(t => t.Id);

        // Forzar a que el Guid se cree correctamente como tipo 'uuid' en Postgres
        entity.Property(t => t.Id)
            .HasColumnName("id");

        // Configurar precisión bancaria estándar (18 dígitos, 4 decimales)
        entity.Property(t => t.Monto)
            .HasColumnType("numeric(18,4)")
            .HasColumnName("monto");

        entity.Property(t => t.TipoTransaccion)
            .HasColumnName("tipo_transaccion");

        entity.Property(t => t.CuentaOrigen)
            .HasColumnName("cuenta_origen");

        entity.Property(t => t.CuentaDestino)
            .HasColumnName("cuenta_destino");

        entity.Property(t => t.Moneda)
            .HasMaxLength(10)
            .HasColumnName("moneda");

        entity.Property(t => t.Descripcion)
            .HasMaxLength(250)
            .HasColumnName("descripcion");

        entity.Property(t => t.Estado)
            .HasMaxLength(50)
            .HasColumnName("estado");

        entity.Property(t => t.FechaCreacion)
            .HasColumnName("fecha_creacion");
    });
}
}