using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APIMaraton.Models
{
    [Table("UserMoviePreferences")]
    public class UserMoviePreference
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_user_preference")]
        public int IdUserPreference { get; set; }

        [Required]
        [Column("id_user")]
        public int IdUser { get; set; }

        [Required]
        [Column("id_movie_tmdb")]
        public int IdMovieTmdb { get; set; }

        [Required]
        [Column("is_favorite")]
        public bool IsFavorite { get; set; }

        [Required]
        [Column("is_hidden")]
        public bool IsHidden { get; set; }

        [Required]
        [Column("date_modified")]
        public DateTime DateModified { get; set; } = DateTime.UtcNow;

        [ForeignKey("IdUser")]
        public virtual User User { get; set; } = null!;
    }
}