using System;
using System.Collections.Generic;

namespace Domain
{
    public class Tournament
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Sport { get; set; }
        public DateTime Date { get; set; }
        public Location Location { get; set; }
        public AppUser Host { get; set; }
        public bool ApplicationsClosed { get; set; } = false;
        public ICollection<Admin> Admins {get; set;} = new List<Admin>();
        public ICollection<Contestor> Contestors { get; set; } = new List<Contestor>();
        public ICollection<Game> Games { get; set; }
        public int NumberOfRounds { get; set; }
        public int CurrentRound { get; set; } = 0;
    }
}