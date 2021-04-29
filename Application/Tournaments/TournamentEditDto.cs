using System;

namespace Application.Tournaments
{
    public class TournamentEditDto
    {
        public string Name { get; set; }
        public string Sport { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public int NumberOfRounds { get; set; }
    }
}