using System;
using System.Collections.Generic;

namespace Domain
{
    public class Contestor
    {
        public Guid Id { get; set; }
        public string DisplayName { get; set; }
    
        public AppUser AppUser { get; set; }
        public string AppUserId { get; set; }
        public Tournament Tournament { get; set; }
        public Guid TournamentId { get; set; }
        public int? Rating { get; set; } = null;
        public int Wins { get; set; } = 0;
        public int Loses { get; set; } = 0;
        public int Draws { get; set; } = 0;
        public float Score => Wins * 1 + Draws * 0.5f;
        public bool RoundPaused { get; set; } = false;
        public ICollection<Game> GamesAsContstor1 { get; set; }
        public ICollection<Game> GamesAsContestor2 {get; set; }
    }
}