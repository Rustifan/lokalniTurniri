
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class Seed
    {
        private readonly List<string> Sports = new() { "balote", "šah", "potezanje konopa", "nogomet", "briškula", "bela", "guranje kamena"};
        private readonly List<string> Locations = new(){"Zaton", "Prvić Šepurine", "Prvić Luka", "Tribunj"};

        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        public Seed(DataContext context, UserManager<AppUser> usermanager)
        {
               _context = context;
               _userManager = usermanager;
        }

        public async Task Reseed(int num = 20)
        {
            if(await _context.Tournaments.AnyAsync()) return;
            
            var users = new List<AppUser> 
            {
                new AppUser{UserName = "Beki", Email="beki@test.com"},
                new AppUser{UserName = "Miki", Email="miki@test.com"},
                new AppUser{UserName = "Franka", Email="franka@test.com"},
                new AppUser{UserName = "Milka", Email="milka@test.com"}
            };

            foreach(var user in users)
            {
                string password = "Asdf1234";
                await _userManager.CreateAsync(user, password);
            }           

            List<Tournament> tournaments = new();
            var rand = new Random();

            for(int i = 0; i < num; i++)
            {
                string sport = Sports[rand.Next(Sports.Count)];
                string location = Locations[rand.Next(Locations.Count)];
                DateTime date = DateTime.Now.AddDays(rand.Next(60));
                var host = users[rand.Next(users.Count)];
                
                

                var tournament = new Tournament
                {
                    Sport = sport,
                    Location = location,
                    Date = date,
                    Host = host,
                    
                };
                tournament.Admins = new List<Admin>{new Admin{Tournament=tournament, User=host}};
                tournaments.Add(tournament);
            }

            _context.Tournaments.AddRange(tournaments);
            await _context.SaveChangesAsync();

        }
    }
}