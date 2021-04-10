using System;

namespace Domain
{
    public class Admin
    {
        public Guid TournamentId { get; set; }
        public Tournament Tournament { get; set; }
        public string AppUserId { get; set; }
        public AppUser User { get; set; }
    }
}