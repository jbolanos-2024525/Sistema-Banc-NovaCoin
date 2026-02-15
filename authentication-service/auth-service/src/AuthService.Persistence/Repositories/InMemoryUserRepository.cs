using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;
using BCrypt.Net;

namespace AuthService.Persistence.Repositories;

public class InMemoryUserRepository : IUserRepository
{
    private readonly List<UserRole> _users =
    [
        new UserRole
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = "ADMIN_ROLE"
        }
    ];

    public User? GetByUsername(string username)
        => _users.FirstOrDefault(u => u.Username == username);

    public User Add(User user)
    {
        _users.Add(user);
        return user;
    }
}
