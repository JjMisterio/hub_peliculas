using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APIMaraton.Data;
using APIMaraton.Models;
using APIMaraton.Services;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace APIMaraton.Controllers
{
    /// <summary>
    /// Controlador para gestionar las operaciones relacionadas con usuarios
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    [Tags("Usuarios")]
    public class UsersController : ControllerBase
    {
        private readonly MaratonContext _context;

        public UsersController(MaratonContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Autentica a un usuario en el sistema
        /// </summary>
        /// <param name="loginDto">Credenciales del usuario (email y contraseña)</param>
        /// <returns>Información del usuario autenticado</returns>
        /// <response code="200">Retorna la información del usuario</response>
        /// <response code="401">Credenciales inválidas</response>
        /// <response code="400">Datos de entrada inválidos</response>
        /// <remarks>
        /// Ejemplo de solicitud:
        /// 
        ///     POST /api/Users/login
        ///     {
        ///         "email": "juan.perez@ejemplo.com",
        ///         "password": "Contraseña123!"
        ///     }
        /// </remarks>
        [HttpPost("login")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

        /// <summary>
        /// Obtiene la lista de todos los usuarios registrados
        /// </summary>
        /// <returns>Lista de usuarios</returns>
        /// <response code="200">Retorna la lista de usuarios</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserResponseDto>), StatusCodes.Status200OK)]
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

        /// <summary>
        /// Obtiene la información de un usuario específico
        /// </summary>
        /// <param name="id">ID del usuario</param>
        /// <returns>Información del usuario</returns>
        /// <response code="200">Retorna la información del usuario</response>
        /// <response code="404">Usuario no encontrado</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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

        /// <summary>
        /// Crea un nuevo usuario en el sistema
        /// </summary>
        /// <param name="userDto">Datos del nuevo usuario</param>
        /// <returns>Información del usuario creado</returns>
        /// <response code="201">Usuario creado exitosamente</response>
        /// <response code="400">Datos de entrada inválidos o email ya registrado</response>
        /// <remarks>
        /// Ejemplo de solicitud:
        /// 
        ///     POST /api/Users
        ///     {
        ///         "name": "Juan Pérez",
        ///         "email": "juan.perez@ejemplo.com",
        ///         "password": "Contraseña123!"
        ///     }
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
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

        /// <summary>
        /// Actualiza la información de un usuario existente
        /// </summary>
        /// <param name="id">ID del usuario a actualizar</param>
        /// <param name="userDto">Nueva información del usuario</param>
        /// <returns>Sin contenido</returns>
        /// <response code="204">Usuario actualizado exitosamente</response>
        /// <response code="400">Datos de entrada inválidos</response>
        /// <response code="404">Usuario no encontrado</response>
        /// <remarks>
        /// Ejemplo de solicitud:
        /// 
        ///     PUT /api/Users/1
        ///     {
        ///         "name": "Juan Pérez Actualizado",
        ///         "email": "juan.perez@ejemplo.com",
        ///         "password": "NuevaContraseña123!"
        ///     }
        /// </remarks>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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

        /// <summary>
        /// Elimina un usuario del sistema
        /// </summary>
        /// <param name="id">ID del usuario a eliminar</param>
        /// <returns>Sin contenido</returns>
        /// <response code="204">Usuario eliminado exitosamente</response>
        /// <response code="404">Usuario no encontrado</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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