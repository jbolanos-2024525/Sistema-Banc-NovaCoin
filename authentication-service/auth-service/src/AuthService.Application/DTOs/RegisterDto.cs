namespace AuthService.Application.DTOs;

public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    // para tu gestión, puedes permitir ADMIN_ROLE
    public string Role { get; set; } = "ADMIN_ROLE";
}
