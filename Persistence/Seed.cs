
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class Seed
    {
        private List<string> Sports = new() { "balote", "šah", "potezanje konopa", "nogomet", "briškula", "bela", "guranje kamena"};
        private List<string> Locations = new(){"Zaton", "Prvić Šepurine", "Prvić Luka", "Tribunj"};

        private readonly DataContext _context;
        public Seed(DataContext context)
        {
               _context = context;
        }

        public async Task Reseed(int num = 20)
        {
            if(await _context.Tournaments.AnyAsync()) return;
            

            List<Tournament> tournaments = new();
            var rand = new Random();

            for(int i = 0; i < num; i++)
            {
                string sport = Sports[rand.Next(Sports.Count)];
                string location = Locations[rand.Next(Locations.Count)];
                DateTime date = DateTime.Now.AddDays(rand.Next(60));

                var tournament = new Tournament
                {
                    Sport = sport,
                    Location = location,
                    Date = date
                };
                tournaments.Add(tournament);
            }

            _context.Tournaments.AddRange(tournaments);
            await _context.SaveChangesAsync();

        }
    }
}