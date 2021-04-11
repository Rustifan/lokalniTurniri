using System;

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
        public int Wins { get; set; } = 0;
        public int Loses { get; set; } = 0;

    }
}