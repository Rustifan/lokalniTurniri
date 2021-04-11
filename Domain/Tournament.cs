using System;
using System.Collections.Generic;

namespace Domain
{
    public class Tournament
    {
        public Guid Id { get; set; }
        public string Sport { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public AppUser Host { get; set; }
        public bool ApplicationsClosed { get; set; } = false;
        public ICollection<Admin> Admins {get; set;} = new List<Admin>();
        public ICollection<Contestor> Contestors { get; set; } = new List<Contestor>();
    }
}