using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace APIMaraton.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id_user")]
        public int IdUser { get; set; }

        [Required]
        [StringLength(200)]
        [Column("name")]
        public required string Name { get; set; }

        [Required]
        [StringLength(255)]
        [EmailAddress]
        [Column("email")]
        public required string Email { get; set; }

        [Required]
        [Column("password_hash")]
        public required byte[] PasswordHash { get; set; }

        [Required]
        [Column("date_creation")]
        public DateTime DateCreation { get; set; } = DateTime.UtcNow;

        public virtual ICollection<UserMoviePreference> UserMoviePreferences { get; set; } = new List<UserMoviePreference>();
    }
}