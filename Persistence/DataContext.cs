using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;



namespace Persistence
{
    public class DataContext: IdentityDbContext<AppUser>
    {

        public DataContext(DbContextOptions options): base(options)
        {
            
        }
        public DbSet<Tournament> Tournaments { get; set; }
        public DbSet<Admin> Admins {get; set;}

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Admin>()
                .HasKey(a=>new {a.AppUserId, a.TournamentId});
            builder.Entity<Admin>()
                .HasOne(a=>a.User)
                .WithMany(x=>x.TournamentsAdmin)
                .HasForeignKey(x=>x.AppUserId);
            
            builder.Entity<Admin>()
                .HasOne(x=>x.Tournament)
                .WithMany(x=>x.Admins)
                .HasForeignKey(x=>x.TournamentId);
            
            base.OnModelCreating(builder);
        }
    }
}