using System;
using System.Collections.Generic;

namespace Application.Tournaments
{
    public class TournamentDto
    {
        public Guid Id { get; set; }
        public string Sport { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public string HostUsername { get; set; }
        public List<string> Admins {get; set;}
    }
}