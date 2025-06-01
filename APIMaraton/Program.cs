using Microsoft.EntityFrameworkCore;
using APIMaraton.Data;
using APIMaraton.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Leer la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("MaratonDatabase");

// 2. Registrar el DbContext
builder.Services.AddDbContext<MaratonContext>(options =>
    options.UseSqlServer(connectionString));

// Add services to the container.
builder.Services.AddControllers();

// Configuración de CORS
var corsSettings = builder.Configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings 
{ 
    AllowedOrigins = new[] { "http://localhost:4200" } 
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevServer",
        builder =>
        {
            builder.WithOrigins(corsSettings.AllowedOrigins)
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "API MaratON de Películas",
        Version = "v1",
        Description = "API para gestionar usuarios y preferencias de películas",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Jesús Isaac E. R.",
            Email = "argim.1000@gmail.com"
        },
        License = new Microsoft.OpenApi.Models.OpenApiLicense
        {
            Name = "MIT License",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Configurar la ruta del archivo XML de documentación
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar CORS antes de las redirecciones HTTPS
app.UseCors("AllowAngularDevServer");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();