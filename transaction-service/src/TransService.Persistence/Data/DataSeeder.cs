using TransService.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TransService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!await context.Transacciones.AnyAsync())
        {
            var transacciones = new List<Transaccion>
            {
                new()
                {
                    TipoTransaccion  = "Deposito",
                    Monto            = 1000m,
                    NumeroReferencia = "REF-001-2026",
                    Descripcion      = "Depósito inicial de prueba",
                    FechaTransaccion = DateTime.UtcNow,
                    IdCuenta         = 1,
                    IdEmpleado       = 1
                },
                new()
                {
                    TipoTransaccion  = "Retiro",
                    Monto            = 250m,
                    NumeroReferencia = "REF-002-2026",
                    Descripcion      = "Retiro de prueba",
                    FechaTransaccion = DateTime.UtcNow,
                    IdCuenta         = 1,
                    IdEmpleado       = 1
                }
            };

            await context.Transacciones.AddRangeAsync(transacciones);
            await context.SaveChangesAsync();
        }
    }
}
