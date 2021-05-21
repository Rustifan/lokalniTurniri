using Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System;

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
        public DbSet<Game> Games { get; set; }
        public DbSet<Image> Images { get; set; }
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

            //Games setup
            builder.Entity<Game>()
                .HasOne(x=>x.Tournament)
                .WithMany(x=>x.Games)
                .HasForeignKey(x=>x.TournamentId);
                
            builder.Entity<Game>()
                .HasOne(x=>x.Contestor1)
                .WithMany(x=>x.GamesAsContstor1)
                .HasForeignKey(x=>x.Contestor1Id);
            
            builder.Entity<Game>()
                .HasOne(x=>x.Contestor2)
                .WithMany(x=>x.GamesAsContestor2)
                .HasForeignKey(x=>x.Contestor2Id);
            

            // pass builder to parent class
            
            base.OnModelCreating(builder);
        }

        
        
    }
}