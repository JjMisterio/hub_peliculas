using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APIMaraton.Data;
using APIMaraton.Models;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace APIMaraton.Controllers
{
    /// <summary>
    /// Controlador para gestionar las preferencias de películas de los usuarios
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    [Tags("Preferencias de Películas")]
    public class UserMoviePreferencesController : ControllerBase
    {
        private readonly MaratonContext _context;

        public UserMoviePreferencesController(MaratonContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtiene todas las preferencias de películas de todos los usuarios
        /// </summary>
        /// <returns>Lista de preferencias de películas</returns>
        /// <response code="200">Retorna la lista de preferencias</response>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserMoviePreferenceResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserMoviePreferenceResponseDto>>> GetUserMoviePreferences()
        {
            return await _context.UserMoviePreferences
                .Include(p => p.User)
                .Select(p => new UserMoviePreferenceResponseDto
                {
                    IdUserPreference = p.IdUserPreference,
                    IdUser = p.IdUser,
                    IdMovieTmdb = p.IdMovieTmdb,
                    IsFavorite = p.IsFavorite,
                    IsHidden = p.IsHidden,
                    DateModified = p.DateModified,
                    UserName = p.User.Name,
                    UserEmail = p.User.Email
                })
                .ToListAsync();
        }

        /// <summary>
        /// Obtiene una preferencia de película específica
        /// </summary>
        /// <param name="id">ID de la preferencia</param>
        /// <returns>Información de la preferencia</returns>
        /// <response code="200">Retorna la información de la preferencia</response>
        /// <response code="404">Preferencia no encontrada</response>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserMoviePreferenceResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserMoviePreferenceResponseDto>> GetUserMoviePreference(int id)
        {
            var preference = await _context.UserMoviePreferences
                .Include(p => p.User)
                .Where(p => p.IdUserPreference == id)
                .Select(p => new UserMoviePreferenceResponseDto
                {
                    IdUserPreference = p.IdUserPreference,
                    IdUser = p.IdUser,
                    IdMovieTmdb = p.IdMovieTmdb,
                    IsFavorite = p.IsFavorite,
                    IsHidden = p.IsHidden,
                    DateModified = p.DateModified,
                    UserName = p.User.Name,
                    UserEmail = p.User.Email
                })
                .FirstOrDefaultAsync();

            if (preference == null)
            {
                return NotFound();
            }

            return preference;
        }

        /// <summary>
        /// Obtiene todas las preferencias de películas de un usuario específico
        /// </summary>
        /// <param name="userId">ID del usuario</param>
        /// <returns>Lista de preferencias del usuario</returns>
        /// <response code="200">Retorna la lista de preferencias del usuario</response>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(IEnumerable<UserMoviePreferenceResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserMoviePreferenceResponseDto>>> GetUserPreferences(int userId)
        {
            return await _context.UserMoviePreferences
                .Include(p => p.User)
                .Where(p => p.IdUser == userId)
                .Select(p => new UserMoviePreferenceResponseDto
                {
                    IdUserPreference = p.IdUserPreference,
                    IdUser = p.IdUser,
                    IdMovieTmdb = p.IdMovieTmdb,
                    IsFavorite = p.IsFavorite,
                    IsHidden = p.IsHidden,
                    DateModified = p.DateModified,
                    UserName = p.User.Name,
                    UserEmail = p.User.Email
                })
                .ToListAsync();
        }

        /// <summary>
        /// Crea una nueva preferencia de película para un usuario
        /// </summary>
        /// <param name="preferenceDto">Datos de la preferencia</param>
        /// <returns>Información de la preferencia creada</returns>
        /// <response code="201">Preferencia creada exitosamente</response>
        /// <response code="400">Datos de entrada inválidos o preferencia ya existe</response>
        /// <remarks>
        /// Ejemplo de solicitud:
        /// 
        ///     POST /api/UserMoviePreferences
        ///     {
        ///         "idUser": 1,
        ///         "idMovieTmdb": 550,
        ///         "isFavorite": true,
        ///         "isHidden": false
        ///     }
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(UserMoviePreferenceResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserMoviePreferenceResponseDto>> CreateUserMoviePreference(UserMoviePreferenceDto preferenceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el usuario existe
            var user = await _context.Users.FindAsync(preferenceDto.IdUser);
            if (user == null)
            {
                return BadRequest("El usuario no existe");
            }

            // Verificar si ya existe una preferencia para esta película y usuario
            if (await _context.UserMoviePreferences
                .AnyAsync(p => p.IdUser == preferenceDto.IdUser && p.IdMovieTmdb == preferenceDto.IdMovieTmdb))
            {
                return BadRequest("Ya existe una preferencia para esta película");
            }

            var preference = new UserMoviePreference
            {
                IdUser = preferenceDto.IdUser,
                IdMovieTmdb = preferenceDto.IdMovieTmdb,
                IsFavorite = preferenceDto.IsFavorite,
                IsHidden = preferenceDto.IsHidden,
                DateModified = DateTime.UtcNow
            };

            _context.UserMoviePreferences.Add(preference);
            await _context.SaveChangesAsync();

            // Devolver la preferencia creada con la información del usuario
            return new UserMoviePreferenceResponseDto
            {
                IdUserPreference = preference.IdUserPreference,
                IdUser = preference.IdUser,
                IdMovieTmdb = preference.IdMovieTmdb,
                IsFavorite = preference.IsFavorite,
                IsHidden = preference.IsHidden,
                DateModified = preference.DateModified,
                UserName = user.Name,
                UserEmail = user.Email
            };
        }

        /// <summary>
        /// Actualiza una preferencia de película existente
        /// </summary>
        /// <param name="id">ID de la preferencia</param>
        /// <param name="preferenceDto">Nueva información de la preferencia</param>
        /// <returns>Sin contenido</returns>
        /// <response code="204">Preferencia actualizada exitosamente</response>
        /// <response code="400">Datos de entrada inválidos</response>
        /// <response code="404">Preferencia no encontrada</response>
        /// <remarks>
        /// Ejemplo de solicitud:
        /// 
        ///     PUT /api/UserMoviePreferences/1
        ///     {
        ///         "idUser": 1,
        ///         "idMovieTmdb": 550,
        ///         "isFavorite": false,
        ///         "isHidden": true
        ///     }
        /// </remarks>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserMoviePreference(int id, UserMoviePreferenceDto preferenceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var preference = await _context.UserMoviePreferences.FindAsync(id);
            if (preference == null)
            {
                return NotFound();
            }

            // Verificar si el usuario existe
            if (!await _context.Users.AnyAsync(u => u.IdUser == preferenceDto.IdUser))
            {
                return BadRequest("El usuario no existe");
            }

            preference.IdUser = preferenceDto.IdUser;
            preference.IdMovieTmdb = preferenceDto.IdMovieTmdb;
            preference.IsFavorite = preferenceDto.IsFavorite;
            preference.IsHidden = preferenceDto.IsHidden;
            preference.DateModified = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserMoviePreferenceExists(id))
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
        /// Elimina una preferencia de película
        /// </summary>
        /// <param name="id">ID de la preferencia a eliminar</param>
        /// <returns>Sin contenido</returns>
        /// <response code="204">Preferencia eliminada exitosamente</response>
        /// <response code="404">Preferencia no encontrada</response>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUserMoviePreference(int id)
        {
            var preference = await _context.UserMoviePreferences.FindAsync(id);
            if (preference == null)
            {
                return NotFound();
            }

            _context.UserMoviePreferences.Remove(preference);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserMoviePreferenceExists(int id)
        {
            return _context.UserMoviePreferences.Any(e => e.IdUserPreference == id);
        }
    }
} 