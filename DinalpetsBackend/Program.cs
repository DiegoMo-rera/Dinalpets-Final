var builder = WebApplication.CreateBuilder(args);

// Configuración de CORS para permitir peticiones desde Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAngular");

// Ruta de prueba
app.MapGet("/api/mascotas", () =>
{
    return new[]
    {
        new { id = 1, nombre = "Max", especie = "Perro" },
        new { id = 2, nombre = "Luna", especie = "Gato" }
    };
});

app.Run();