using AuthService.Domain.Entities;

namespace AuthService.Domain.Interfaces;

public interface IUserRepository
{
    UserRole? GetByUsername(string username);
    UserRole Add(UserRole user);
}
