using TransService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TransService.Persistence.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Transaccion> Transacciones { get; set; }

    public static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        return string.Concat(
            input.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + c : c.ToString())
        ).ToLower();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            var tableName = entity.GetTableName();
            if (!string.IsNullOrEmpty(tableName))
                entity.SetTableName(ToSnakeCase(tableName));

            foreach (var property in entity.GetProperties())
            {
                var columnName = property.GetColumnName();
                if (!string.IsNullOrEmpty(columnName))
                    property.SetColumnName(ToSnakeCase(columnName));
            }

            foreach (var key in entity.GetKeys())
            {
                var keyName = key.GetName();
                if (!string.IsNullOrEmpty(keyName))
                    key.SetName(ToSnakeCase(keyName));
            }

            foreach (var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if (!string.IsNullOrEmpty(indexName))
                    index.SetDatabaseName(ToSnakeCase(indexName));
            }
        }

        modelBuilder.Entity<Transaccion>(entity =>
        {
            entity.HasKey(e => e.IdTransaccion);
            entity.Property(e => e.IdTransaccion).ValueGeneratedOnAdd();
            entity.Property(e => e.TipoTransaccion).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Monto).HasColumnType("decimal(12,2)").IsRequired();
            entity.Property(e => e.NumeroReferencia).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Descripcion).HasMaxLength(200);
            entity.Property(e => e.FechaTransaccion).IsRequired();
            entity.Property(e => e.IdCuenta).IsRequired();
            entity.Property(e => e.IdEmpleado).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
            entity.Property(e => e.UpdatedAt).IsRequired();

            entity.HasIndex(e => e.NumeroReferencia).IsUnique();
            entity.HasIndex(e => e.IdCuenta);
            entity.HasIndex(e => e.IdEmpleado);
        });
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is Transaccion transaccion)
            {
                if (entry.State == EntityState.Added)
                    transaccion.CreatedAt = DateTime.UtcNow;
                transaccion.UpdatedAt = DateTime.UtcNow;
            }
        }
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }
}
