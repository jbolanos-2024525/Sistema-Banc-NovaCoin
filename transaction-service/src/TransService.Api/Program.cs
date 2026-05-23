using TransService.Api.Extensions;
using TransService.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Agregar los controladores y configurarlos para que acepten Enums como String (Texto)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Esto permite enviar "TRANSFERENCIA" en lugar de números en el JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Configurar los servicios de la aplicación (BD, Repositorios, Servicios y CORS)
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aplicar migraciones y seed automáticamente de forma asíncrona
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Evita bloqueos de hilos al arrancar el contenedor aplicando migraciones en async
    await db.Database.MigrateAsync();
    
    // Ejecuta el data seeder de forma segura
    await DataSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// El middleware de CORS se mantiene antes de Authorization y Controllers
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

app.Run();