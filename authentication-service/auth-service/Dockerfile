# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar archivos del proyecto
COPY ["src/AuthService.Api/AuthService.Api.csproj", "src/AuthService.Api/"]
COPY ["src/AuthService.Application/AuthService.Application.csproj", "src/AuthService.Application/"]
COPY ["src/AuthService.Domain/AuthService.Domain.csproj", "src/AuthService.Domain/"]
COPY ["src/AuthService.Persistence/AuthService.Persistence.csproj", "src/AuthService.Persistence/"]

# Restaurar dependencias
RUN dotnet restore "src/AuthService.Api/AuthService.Api.csproj"

# Copiar todo el código fuente
COPY . .

# Construir el proyecto
WORKDIR "/src/src/AuthService.Api"
RUN dotnet build "AuthService.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "AuthService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Exponer puerto 5000
EXPOSE 5000

# Configurar para producción
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "AuthService.Api.dll"]
