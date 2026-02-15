using AuthService.Domain.Entities;

namespace AuthService.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(UserRole user);
}
