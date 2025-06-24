# APIMaraton/Dockerfile

# Etapa 1: Compilación
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar el archivo .csproj y restaurar dependencias primero para aprovechar el caché de Docker
COPY *.csproj .
RUN dotnet restore

# Copiar el resto del código fuente y compilar
COPY . .
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Exponer el puerto que usa Kestrel dentro del contenedor (8080 es el default en contenedores .NET 8)
EXPOSE 8080

ENTRYPOINT ["dotnet", "APIMaraton.dll"]