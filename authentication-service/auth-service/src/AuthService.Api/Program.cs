using AuthService.Api.Extensions;
using AuthService.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();

// ─── Configuración de Swagger / OpenAPI ───────────────────────────────────────
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title       = "AuthService API",
        Version     = "v1",
        Description = "API REST para la gestión de autenticación y autorización de usuarios. " +
                      "Permite administrar usuarios, roles y sesiones.",
        Contact = new OpenApiContact
        {
            Name  = "Equipo AuthService",
            Email = "soporte@authservice.com",
            Url   = new Uri("https://authservice.com")
        },
        License = new OpenApiLicense
        {
            Name = "MIT",
            Url  = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Incluir comentarios XML de los controladores en Swagger UI
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
        options.IncludeXmlComments(xmlPath);

    // Soporte para JWT Bearer en Swagger UI
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "Bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "Ingresa el token JWT con el prefijo Bearer.\n\nEjemplo: Bearer eyJhbGci..."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id   = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
// ─────────────────────────────────────────────────────────────────────────────

var app = builder.Build();

// Aplicar migraciones y seed automáticamente
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
    await DataSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    // ─── Swagger UI ───────────────────────────────────────────────────────────
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthService API v1");
        options.RoutePrefix        = string.Empty;   // Swagger en la raíz: https://localhost:{port}/
        options.DocumentTitle      = "AuthService API Docs";
        options.DisplayRequestDuration();            // Muestra el tiempo de respuesta
        options.EnableDeepLinking();                 // URLs anclan al endpoint activo
        options.EnableFilter();                      // Barra de búsqueda de endpoints
    });
    // ─────────────────────────────────────────────────────────────────────────
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();