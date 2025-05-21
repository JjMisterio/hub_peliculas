using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using APIMaraton.Data;
using APIMaraton.Models;
using System.Threading.Tasks;
using System.Linq;

namespace APIMaraton.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMoviePreferencesController : ControllerBase
    {
        private readonly MaratonContext _context;

        public UserMoviePreferencesController(MaratonContext context)
        {
            _context = context;
        }

        // GET: api/UserMoviePreferences
        [HttpGet]
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

        // GET: api/UserMoviePreferences/5
        [HttpGet("{id}")]
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

        // GET: api/UserMoviePreferences/user/5
        [HttpGet("user/{userId}")]
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

        // POST: api/UserMoviePreferences
        [HttpPost]
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

        // PUT: api/UserMoviePreferences/5
        [HttpPut("{id}")]
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

        // DELETE: api/UserMoviePreferences/5
        [HttpDelete("{id}")]
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