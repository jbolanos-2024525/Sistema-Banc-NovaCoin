using Microsoft.Extensions.Configuration;

using AuthService.Application.Interfaces;
using AuthService.Domain.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthService.Application.Services;

public class JwtService : IJwtService
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expiresMinutes;


    public JwtService(IConfiguration configuration)
{
    _key = configuration["Jwt:Key"]!;
    _issuer = configuration["Jwt:Issuer"]!;
    _audience = configuration["Jwt:Audience"]!;
    _expiresMinutes = int.Parse(configuration["Jwt:ExpiresMinutes"] ?? "60");
}


    public string GenerateToken(User user)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_key);
        if (keyBytes.Length < 32)
            throw new Exception("Jwt key debe tener mínimo 32 caracteres");

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(keyBytes),
            SecurityAlgorithms.HmacSha256
        );

        var userRole = user.UserRoles.FirstOrDefault()?.Role?.Name ?? "USER_ROLE";

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.UniqueName, user.Username),
            new("role", userRole),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            _issuer,
            _audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_expiresMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}