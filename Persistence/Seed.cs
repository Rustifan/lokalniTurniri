
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
        private readonly List<string> Names = new(){"nasmijani", "dobri", "sahranjeni", "kakovi", "postojani", "moderni", "domaći", "zastupljeni",
        "kunkunski", "gospodnji", "lokalni", "gradski", "veliki", "mali", "koliki", "moj", "zub", "konkurentski",
        "šepurinski", "anemični", "ajme", "najbolji", "mrki", "golemi", "sportski", "udri"};
        
        private const string Description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        private readonly List<Location> Locations = new()
        {
            new Location
            {
                LocationString="Prvić Luka",
                FormattedLocation="Privić Luka",
                Lat=43.7252575,
                Lng=15.7973748
            },
            new Location
            {
                LocationString="Zlarin",
                FormattedLocation="Zlarin",
                Lat= 43.689557699,
                Lng= 15.8466437

            },
            new Location
            {
                LocationString="Zagreb",
                FormattedLocation="Zagreb",
                Lat=45.8150108,
                Lng=15.9819189
            }
        };

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
                new AppUser{UserName = "Beki", Email="beki@test.com", EmailConfirmed=true},
                new AppUser{UserName = "Miki", Email="miki@test.com", EmailConfirmed=true},
                new AppUser{UserName = "Franka", Email="franka@test.com", EmailConfirmed=true},
                new AppUser{UserName = "Milka", Email="milka@test.com", EmailConfirmed=true},
                new AppUser{UserName = "Bojan", Email="bojan@test.com", EmailConfirmed=true}
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
                
                var locationOffsetSize = 0.001;
                var randomLngOffset = (rand.NextDouble() * 2 - 1)* locationOffsetSize;
                var randomLatOffset = (rand.NextDouble() * 2 - 1)* locationOffsetSize;
                Location location = Locations[rand.Next(Locations.Count)];
                Location newLocation = new()
                {
                    LocationString = location.LocationString,
                    FormattedLocation = location.FormattedLocation,
                    Lat = location.Lat + randomLatOffset,
                    Lng = location.Lng + randomLngOffset
                };
                

                DateTime date = DateTime.Now.AddDays(rand.Next(60));
                var host = users[rand.Next(users.Count)];
                
                var name = GetName();
                var numOfRounds = rand.Next(1,11);
                var tournament = new Tournament
                {
                    Name = name,
                    Sport = sport,
                    Location = newLocation,
                    Description = Description,
                    Date = date,
                    Host = host,
                    NumberOfRounds = numOfRounds
                };
                tournament.Admins = new List<Admin>{new Admin{Tournament=tournament, User=host}};

                //contestors generate

                AddContestors(tournament, users);

                tournaments.Add(tournament);
            }
            


            _context.Tournaments.AddRange(tournaments);
            await _context.SaveChangesAsync();

        }
        private string GetName()
        {
            var rand = new Random();
            var wordCount = rand.Next(1,4);
            string name = "";
            
            var names = new List<string>(Names);

            for(int i = 0; i < wordCount; i++)
            {
                int nameIndex = rand.Next(names.Count);

                string word = i == 0 ? 
                    char.ToUpper(names[nameIndex][0]) + names[nameIndex][1..] :
                    names[nameIndex];  
                name += i == wordCount-1 ? word : word + " ";
                names.RemoveAt(nameIndex);
            }
            name += " turnir";
            return name;
        }
        private static void AddContestors(Tournament tournament, List<AppUser> users)
        {
            var rand = new Random();
            var numOfUserContestors = rand.Next(users.Count+1);
            var usersCopy = new List<AppUser>(users);
            
            for(int i = 0; i < numOfUserContestors; i++)
            {
                var user = usersCopy[rand.Next(usersCopy.Count)];
                var contestor = new Contestor
                {
                    AppUser = user,
                    DisplayName = user.UserName,
                    Tournament = tournament
                };
                usersCopy.Remove(user);
                tournament.Contestors.Add(contestor);
            }

            var names = new List<string>{"Berislav", "Dinkec", "Ante Zanze", "Marelja", "Don Božo", "Pere"};
            var numOfGuests = rand.Next(names.Count+1);

            for(int i = 0; i < numOfGuests; i++)
            {
                var name = names[rand.Next(names.Count)];
                var contestor = new Contestor
                {
                    AppUser = null,
                    DisplayName = name,
                    Tournament = tournament
                };
                tournament.Contestors.Add(contestor);
                names.Remove(name);    
            }
        }
    }
}