using System;
using AuthService.Persistence.Data;   
using Microsoft.EntityFrameworkCore;

namespace AuthService.Api.Extencions;

public static class ServiceColletionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
       services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
            .UseSnakeCaseNamingConvention());
        return services;
    }
}
