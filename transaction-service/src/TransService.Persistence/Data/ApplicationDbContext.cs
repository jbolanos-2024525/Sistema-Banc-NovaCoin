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

    protected override void OnModelCreating(
        ModelBuilder modelBuilder
    )
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Transaccion>()
            .HasKey(t => t.Id);
    }
}