using System;
using System.ComponentModel.DataAnnotations;
 
namespace AuthService.Domain.Entities;
 
public class User
{
    [Key]
    [MaxLength(50)]
    public string Id { get; set; } = string.Empty;
 
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
 
    [Required]
    [MaxLength(50)]
    public string Surname { get; set; } = string.Empty;
 
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
 
    [Required]
    [MaxLength(100)]
    public string Email { get; set; } = string.Empty;
 
    [Required]
    public string Password { get; set; } = string.Empty;
 
    public bool Status { get; set; } = false;
 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
 
    public UserProfile? UserProfile { get; set; }
    public UserEmail? UserEmail { get; set; }
    public UserPasswordReset? UserPasswordReset { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}