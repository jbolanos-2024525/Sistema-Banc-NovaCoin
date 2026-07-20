using System;
using System.Threading.RateLimiting;

namespace AuthService.Api.Extensions;

public static class RateLimitingExtensions
{
    public static IServiceCollection AddRateLimitingPolicies(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            // Rate limiting para autenticación
            options.AddPolicy("AuthPolicy", context =>
                RateLimitPartition.GetFixedWindowLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: partition => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = 1000, // Aumentado para desarrollo
                        Window = TimeSpan.FromMinutes(1) // por minuto
                    }));

            // Rate limiting general para API
            options.AddPolicy("ApiPolicy", context =>
                RateLimitPartition.GetTokenBucketLimiter(
                    partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                    factory: partition => new TokenBucketRateLimiterOptions
                    {
                        TokenLimit = 1000, // Aumentado para desarrollo
                        QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                        QueueLimit = 50,
                        ReplenishmentPeriod = TimeSpan.FromMinutes(1), // se repone cada minuto
                        TokensPerPeriod = 100, // Aumentado para desarrollo
                        AutoReplenishment = true
                    }));

            // Respuesta cuando se excede el límite
            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.StatusCode = 429;
                await context.HttpContext.Response.WriteAsync("Too Many Requests. Please try again later.", token);
            };
        });

        return services;
    }
}