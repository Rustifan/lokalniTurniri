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

        public DbSet<Contestor> Contestors {get; set;}
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Admin many to many setup
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
            
            //Contestor many to many relationship setup
            
                
            builder.Entity<Contestor>()
                .HasOne(x=>x.AppUser)
                .WithMany(x=>x.TournamentContestor)
                .HasForeignKey(x=>x.AppUserId);

            builder.Entity<Contestor>()
                .HasOne(x=>x.Tournament)
                .WithMany(x=>x.Contestors)
                .HasForeignKey(x=>x.TournamentId);

            base.OnModelCreating(builder);
        }
    }
}