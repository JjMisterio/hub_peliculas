namespace APIMaraton.Models
{
    public class AuthResponse
    {
        public UserResponseDto User { get; set; } = null!;
        public string Token { get; set; } = null!;
    }
} 