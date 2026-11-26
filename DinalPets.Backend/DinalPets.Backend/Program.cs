using Microsoft.EntityFrameworkCore;
using DinalPets.Backend;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar la base de datos
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configurar los permisos de CORS para Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aplicar migraciones de Entity Framework al iniciar en Docker
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    for (int intento = 1; intento <= 10; intento++)
    {
        try
        {
            db.Database.Migrate();
            break;
        }
        catch
        {
            if (intento == 10) throw;
            Thread.Sleep(3000);
        }
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 3. Activar CORS (Siempre antes de la autorización)
app.UseCors("PermitirAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();