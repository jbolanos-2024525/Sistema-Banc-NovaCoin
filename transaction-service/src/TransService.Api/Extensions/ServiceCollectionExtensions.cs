using TransService.Application.Interfaces;
using TransService.Application.Services;
using TransService.Domain.Interfaces;
using TransService.Persistence.Data;
using TransService.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace TransService.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Base de datos
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention());

        // Repositorios
        services.AddScoped<ITransaccionRepository, TransaccionRepository>();

        // Servicios
        services.AddScoped<ITransaccionService, TransaccionService>();

        // CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });

        return services;
    }
}
