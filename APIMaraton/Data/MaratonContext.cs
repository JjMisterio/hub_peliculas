using Microsoft.EntityFrameworkCore;
using APIMaraton.Models;

namespace APIMaraton.Data
{
    public class MaratonContext : DbContext
    {
        public MaratonContext(DbContextOptions<MaratonContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserMoviePreference> UserMoviePreferences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la clave única compuesta para UserMoviePreferences
            modelBuilder.Entity<UserMoviePreference>()
                .HasIndex(ump => new { ump.IdUser, ump.IdMovieTmdb })
                .IsUnique();

            // Configuración de la relación User -> UserMoviePreferences
            modelBuilder.Entity<User>()
                .HasMany(u => u.UserMoviePreferences)
                .WithOne(ump => ump.User)
                .HasForeignKey(ump => ump.IdUser)
                .OnDelete(DeleteBehavior.Cascade); // Coincide con ON DELETE CASCADE de la BD

            // Configuración de la restricción única para el email en Users
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}