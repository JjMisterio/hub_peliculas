namespace APIMaraton.Models
{
    public class UserResponseDto
    {
        public int IdUser { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateCreation { get; set; }
    }
} 