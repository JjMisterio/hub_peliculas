using Microsoft.EntityFrameworkCore;
using APIMaraton.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Leer la cadena de conexión
var connectionString = builder.Configuration.GetConnectionString("MaratonDatabase");

// 2. Registrar el DbContext
builder.Services.AddDbContext<MaratonContext>(options =>
    options.UseSqlServer(connectionString));

// Add services to the container.
builder.Services.AddControllers();

// Configuración de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevServer",
        builder =>
        {
            //Esta deberia ser la ip que nos proporciona angular al momento de levantar el server
            //Si el puerto asignado es diferente deberas remplazarlo por el dado en consola
            builder.WithOrigins("http://localhost:4200")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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