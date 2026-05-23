using Microsoft.EntityFrameworkCore;

using TransService.Application.Interfaces;
using TransService.Application.Services;

using TransService.Domain.Interfaces;

using TransService.Persistence.Data;
using TransService.Persistence.Repositories;

namespace TransService.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => 
                {
                    // Fuerza a EF Core a buscar la tabla de historial con el formato exacto de Postgres
                    npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "public");
                }
            )
            // Esto asegura que todo el contexto use nombres de tablas y columnas en minúsculas (snake_case)
            // de la misma manera que lo hace tu API de autenticación.
            .UseSnakeCaseNamingConvention(); 
        });

        services.AddScoped<
            ITransaccionRepository,
            TransaccionRepository
        >();

        services.AddScoped<
            ITransaccionService,
            TransaccionService
        >();

        services.AddCors(options =>
        {
            options.AddPolicy(
                "AllowAll",
                policy =>
                {
                    policy
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });

        return services;
    }
}