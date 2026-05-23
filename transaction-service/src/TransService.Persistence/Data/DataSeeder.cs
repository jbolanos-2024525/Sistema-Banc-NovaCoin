using Microsoft.EntityFrameworkCore;
using TransService.Domain.Entities;
using TransService.Domain.Enums;

namespace TransService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // 1. Verificamos si ya existen transacciones para no duplicar datos cada vez que corra el proyecto
        if (await context.Transacciones.AnyAsync())
        {
            return; // Si ya hay datos, salimos del método
        }

        // 2. Creamos un par de Guids ficticios para representar cuentas de usuario
        var cuentaIdA = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var cuentaIdB = Guid.Parse("22222222-2222-2222-2222-222222222222");

        // 3. Definimos la lista de transacciones iniciales
        var transaccionesIniciales = new List<Transaccion>
        {
            new Transaccion
            {
                Id = Guid.NewGuid(),
                TipoTransaccion = TipoTransaccion.DEPOSITO,
                CuentaOrigen = null, // En depósito no hay origen externo
                CuentaDestino = cuentaIdA,
                Monto = 1500.00m,
                Moneda = "GTQ",
                Descripcion = "Depósito inicial en efectivo",
                Estado = "COMPLETADA",
                FechaCreacion = DateTime.UtcNow.AddDays(-2)
            },
            new Transaccion
            {
                Id = Guid.NewGuid(),
                TipoTransaccion = TipoTransaccion.TRANSFERENCIA,
                CuentaOrigen = cuentaIdA,
                CuentaDestino = cuentaIdB,
                Monto = 350.50m,
                Moneda = "GTQ",
                Descripcion = "Pago de servicios mensuales",
                Estado = "COMPLETADA",
                FechaCreacion = DateTime.UtcNow.AddDays(-1)
            }
        };

        // 4. Agregamos los datos al contexto y guardamos en PostgreSQL
        await context.Transacciones.AddRangeAsync(transaccionesIniciales);
        await context.SaveChangesAsync();
    }
}