namespace AuthService.Application.DTOs;

public class RegisterDto
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    
    public string? Role { get; set; }
}
