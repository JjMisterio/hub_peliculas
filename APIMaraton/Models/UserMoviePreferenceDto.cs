using System.ComponentModel.DataAnnotations;

namespace APIMaraton.Models
{
    public class UserMoviePreferenceDto
    {
        [Required]
        public int IdUser { get; set; }

        [Required]
        public int IdMovieTmdb { get; set; }

        [Required]
        public bool IsFavorite { get; set; }

        [Required]
        public bool IsHidden { get; set; }
    }
} 