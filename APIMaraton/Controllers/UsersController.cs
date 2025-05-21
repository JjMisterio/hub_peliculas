using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APIMaraton.Data;
using APIMaraton.Models;
using APIMaraton.Services;
using System.Threading.Tasks;
using System.Linq;

namespace APIMaraton.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MaratonContext _context;

        public UsersController(MaratonContext context)
        {
            _context = context;
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<UserResponseDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Credenciales inválidas");
            }

            if (!PasswordHasher.VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Credenciales inválidas");
            }

            return new UserResponseDto
            {
                IdUser = user.IdUser,
                Name = user.Name,
                Email = user.Email,
                DateCreation = user.DateCreation
            };
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            return await _context.Users
                                 .Select(u => new UserResponseDto 
                                 { 
                                     IdUser = u.IdUser, 
                                     Name = u.Name, 
                                     Email = u.Email, 
                                     DateCreation = u.DateCreation
                                 })
                                 .ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users
                                     .Select(u => new UserResponseDto 
                                     { 
                                         IdUser = u.IdUser, 
                                         Name = u.Name, 
                                         Email = u.Email, 
                                         DateCreation = u.DateCreation
                                     })
                                     .FirstOrDefaultAsync(u => u.IdUser == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el email ya existe
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("El email ya está registrado");
            }

            var user = new User
            {
                Name = userDto.Name,
                Email = userDto.Email,
                PasswordHash = PasswordHasher.HashPassword(userDto.Password),
                DateCreation = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.IdUser }, new UserResponseDto
            { 
                IdUser = user.IdUser, 
                Name = user.Name, 
                Email = user.Email, 
                DateCreation = user.DateCreation 
            });
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            // Verificar si el nuevo email ya existe (si se está cambiando)
            if (existingUser.Email != userDto.Email && 
                await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest("El email ya está registrado");
            }

            existingUser.Name = userDto.Name;
            existingUser.Email = userDto.Email;
            
            // Solo actualizar la contraseña si se proporciona una nueva
            if (!string.IsNullOrEmpty(userDto.Password))
            {
                existingUser.PasswordHash = PasswordHasher.HashPassword(userDto.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.IdUser == id);
        }
    }
}