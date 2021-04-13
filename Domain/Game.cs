using System;

namespace Domain
{
    public class Game
    {
        public Guid Id { get; set; }
        public Guid Contestor1Id { get; set; }
        public Contestor Contestor1 { get; set; }
        public Guid Contestor2Id { get; set; }
        public Contestor Contestor2 { get; set; }
        public Guid TournamentId { get; set; }
        public Tournament Tournament { get; set; }
        public int Round { get; set; }
        public int Result { get; set; }
    }
}