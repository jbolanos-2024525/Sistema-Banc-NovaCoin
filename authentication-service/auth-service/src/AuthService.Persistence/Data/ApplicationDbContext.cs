using System;
using AuthService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Role> Roles { get; set; }
    public DbSet<Cliente> Clientes { get; set; }
    public DbSet<Cuenta> Cuentas { get; set; }

    public static string ToSnakeCase(string input)
    {
        if(string.IsNullOrEmpty(input))
            return input;
        
        return string.Concat(
            input.Select((c, i) => i > 0 && char.IsUpper(c) ? "_" + c : c.ToString())
        ).ToLower();
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach(var entity in modelBuilder.Model.GetEntityTypes())
        {
            var tableName = entity.GetTableName();
            //Snake case para nombres de tablas
            if(!string.IsNullOrEmpty(tableName))
            {
                entity.SetTableName(ToSnakeCase(tableName));
            }
            //Snake case para columnas
            foreach(var property in entity.GetProperties())
            {
                var columnName = property.GetColumnName();
                if(!string.IsNullOrEmpty(columnName))
                {
                    property.SetColumnName(ToSnakeCase(columnName));
                }
            }
            //foreign keys y primary keys snake_case
            foreach(var key in entity.GetKeys())
            {
                var keyName = key.GetName();
                if(!string.IsNullOrEmpty(keyName))
                {
                    key.SetName(ToSnakeCase(keyName));
                }
            }
            //indexes snake_case
            foreach(var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if(!string.IsNullOrEmpty(indexName))
                {
                    index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }
        }
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasMaxLength(16)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(35);
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasMany(e => e.UserRoles)
                .WithOne(r => r.Role)
                .HasForeignKey(ur => ur.RoleId);
        });
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.IdCliente);
            entity.Property(e => e.IdCliente)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.Nombre)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.Apellido)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.Dpi)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.Direccion)
                .HasMaxLength(100);
            entity.Property(e => e.Telefono)
                .HasMaxLength(15);
            entity.Property(e => e.Correo)
                .HasMaxLength(50);
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasIndex(e => e.Dpi).IsUnique();
        });
        modelBuilder.Entity<Cuenta>(entity =>
        {
            entity.HasKey(e => e.IdCuenta);
            entity.Property(e => e.IdCuenta)
                .ValueGeneratedOnAdd();
            entity.Property(e => e.NumeroCuenta)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.TipoCuenta)
                .IsRequired()
                .HasMaxLength(20);
            entity.Property(e => e.Saldo)
                .HasColumnType("decimal(12,2)");
            entity.Property(e => e.FechaApertura)
                .HasDefaultValueSql("CURRENT_DATE");
            entity.Property(e => e.IdCliente)
                .IsRequired();
            entity.Property(e => e.CreatedAt)
                .IsRequired();
            entity.Property(e => e.UpdatedAt)
                .IsRequired();
            entity.HasIndex(e => e.NumeroCuenta).IsUnique();
        });
    }
    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => (e.Entity is Cliente 
                    || e.Entity is Cuenta 
                    || e.Entity is Role)
                && (e.State == EntityState.Added 
                || e.State == EntityState.Modified));
        foreach (var entry in entries)
        {
            if (entry.Entity is Cliente cliente)
            {
                if (entry.State == EntityState.Added)
                {
                    cliente.CreatedAt = DateTime.UtcNow;
                }
                cliente.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Cuenta cuenta)
            {
                if (entry.State == EntityState.Added)
                {
                    cuenta.CreatedAt = DateTime.UtcNow;
                }
                cuenta.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is Role role)
            {
                if (entry.State == EntityState.Added)
                {
                    role.CreatedAt = DateTime.UtcNow;
                }
                role.UpdatedAt = DateTime.UtcNow;
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
