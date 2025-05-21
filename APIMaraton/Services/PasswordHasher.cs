using System.Security.Cryptography;
using System.Text;

namespace APIMaraton.Services
{
    public class PasswordHasher
    {
        public static byte[] HashPassword(string password)
        {
            using (var sha512 = SHA512.Create())
            {
                var passwordBytes = Encoding.UTF8.GetBytes(password);
                return sha512.ComputeHash(passwordBytes);
            }
        }

        public static bool VerifyPassword(string password, byte[] storedHash)
        {
            var computedHash = HashPassword(password);
            return computedHash.SequenceEqual(storedHash);
        }
    }
} 