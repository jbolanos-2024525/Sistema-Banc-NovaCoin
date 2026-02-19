using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;

namespace AuthService.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IJwtService _jwt;

    public AuthService(IUserRepository users, IJwtService jwt)
    {
        _users = users;
        _jwt = jwt;
    }

    public AuthResponseDto Login(LoginDto dto)
    {
        var user = _users.GetByUsername(dto.Username);

        // Verificación simple de contraseña 
        if (user == null || user.Password != dto.Password)
        {
            return new AuthResponseDto 
            { 
                Success = false, 
                Message = "Credenciales inválidas" 
            };
        }

        // Verificar si el usuario está activo
        if (!user.Status)
        {
            return new AuthResponseDto 
            { 
                Success = false, 
                Message = "La cuenta está deshabilitada" 
            };
        }

        var userRole = user.UserRoles.FirstOrDefault()?.Role?.Name ?? "USER_ROLE";

        return new AuthResponseDto
        {
            Success = true,
            Message = "Login exitoso",
            Token = _jwt.GenerateToken(user),
            User = new UserDetailsDto 
            { 
                Id = user.Id, 
                Username = user.Username, 
                Role = userRole
            }
        };
    }

    public AuthResponseDto Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || 
            string.IsNullOrWhiteSpace(dto.Password) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Surname))
        {
            return new AuthResponseDto 
            { 
                Success = false, 
                Message = "Todos los campos son requeridos" 
            };
        }

        var existsByUsername = _users.GetByUsername(dto.Username);
        if (existsByUsername != null)
        {
            return new AuthResponseDto 
            { 
                Success = false, 
                Message = "El nombre de usuario ya existe" 
            };
        }

        // Crear nuevo usuario
        var newUser = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = dto.Name.Trim(),
            Surname = dto.Surname.Trim(),
            Username = dto.Username.Trim(),
            Email = dto.Email.Trim().ToLower(),
            Password = dto.Password, 
            Status = true, 
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Guardar usuario
        _users.Add(newUser);

        // Determinar rol
        var userRole = string.IsNullOrWhiteSpace(dto.Role) ? "USER_ROLE" : dto.Role.Trim();

        return new AuthResponseDto
        {
            Success = true,
            Message = "Registro exitoso",
            Token = _jwt.GenerateToken(newUser),
            User = new UserDetailsDto 
            { 
                Id = newUser.Id, 
                Username = newUser.Username, 
                Role = userRole
            }
        };
    }
}