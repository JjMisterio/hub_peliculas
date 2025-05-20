namespace APIMaraton.Models
{
    public class UserMoviePreferenceResponseDto
    {
        public int IdUserPreference { get; set; }
        public int IdUser { get; set; }
        public int IdMovieTmdb { get; set; }
        public bool IsFavorite { get; set; }
        public bool IsHidden { get; set; }
        public DateTime DateModified { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
    }
} 