using System.ComponentModel.DataAnnotations;

namespace APIMaraton.Models
{
    public class UserDto
    {
        [Required]
        [StringLength(200)]
        public required string Name { get; set; }

        [Required]
        [StringLength(255)]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        [StringLength(100)]
        [MinLength(8)]
        public required string Password { get; set; }
    }
} 