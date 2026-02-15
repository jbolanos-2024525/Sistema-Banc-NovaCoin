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
        if(!context.Roles.Any())
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
                var clienteId = 1; // si usas Identity, EF lo genera

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
        }
    }