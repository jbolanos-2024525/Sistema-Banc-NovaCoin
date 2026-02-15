using System;
using AuthService.Domain.Entities;
using AuthService.Domain.Constants;
using AuthService.Application.Services;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Persistence.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!context.Roles.Any())
        {
            var roles = new List<Role>
            {
                new()
                {
                    Id = UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.ADMIN_ROLE
                },
                new()
                {
                    Id = UuidGenerator.GenerateRoleId(),
                    Name = RoleConstants.USER_ROLE
                }
            };
            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        // ========================
        // Seed Cliente + Cuenta demo
        // ========================
        if (!await context.Clientes.AnyAsync())
        {
            var cliente = new Cliente
            {
                Nombre = "Juan",
                Apellido = "Pérez",
                Dpi = "1234567890101",
                Direccion = "Ciudad de Guatemala",
                Telefono = "55555555",
                Correo = "juan@demo.com"
            };

            await context.Clientes.AddAsync(cliente);
            await context.SaveChangesAsync();

            var cuenta = new Cuenta
            {
                NumeroCuenta = "000123456789",
                TipoCuenta = "AHORRO",
                Saldo = 1000m,
                IdCliente = cliente.IdCliente
            };

            await context.Cuentas.AddAsync(cuenta);
            await context.SaveChangesAsync();
        }

  
        // Empleado 

        if (!await context.Empleados.AnyAsync())
        {
            var empleado = new Empleado
            {
                Nombre = "Carlos",
                Apellido = "Lopez",
                Correo = "carlos@demo.com",
                Telefono = "44444444"
            };

            await context.Empleados.AddAsync(empleado);
            await context.SaveChangesAsync();
        }


        // Prestamo 

        if (!await context.Prestamos.AnyAsync())
        {
            var cliente = await context.Clientes.FirstOrDefaultAsync();

            if (cliente != null)
            {
                var prestamo = new Prestamo
                {
                    IdCliente = cliente.IdCliente,
                    Monto = 5000m,
                    FechaSolicitud = DateTime.UtcNow,
                    Estado = "APROBADO"
                };

                await context.Prestamos.AddAsync(prestamo);
                await context.SaveChangesAsync();
            }
        }


        // Seed Transaccion demo

        if (!await context.Transacciones.AnyAsync())
        {
            var cuenta = await context.Cuentas.FirstOrDefaultAsync();

            if (cuenta != null)
            {
                var transaccion = new Transaccion
                {
                    IdCuentaOrigen = cuenta.IdCuenta,
                    IdCuentaDestino = cuenta.IdCuenta,
                    Monto = 100m,
                    Fecha = DateTime.UtcNow,
                    TipoTransaccion = "TRANSFERENCIA"
                };

                await context.Transacciones.AddAsync(transaccion);
                await context.SaveChangesAsync();
            }
        }
    }
}
