using System;
using System.Collections.Generic;
using Domain;

namespace Application.Tournaments
{
    public class TournamentDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Sport { get; set; }
        public Location Location { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string HostUsername { get; set; }
        public List<string> Admins {get; set;}
        public int NumberOfRounds { get; set; }
        public int CurrentRound { get; set; }
        public int ContestorNum { get; set; }
        public bool ApplicationsClosed { get; set; }
        public bool Ended { get; set; }
        public bool IsInProcess { get; set; }
        public List<ContestorDto> Contestors { get; set; }
        public List<GameDto> Games { get; set; }


    }
}