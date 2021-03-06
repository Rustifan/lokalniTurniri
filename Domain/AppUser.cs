using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser: IdentityUser
    {
        public string Bio { get; set; }
        public string Avatar { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        public ICollection<Image> Images { get; set; } = new List<Image>();
        public ICollection<Admin> TournamentsAdmin { get; set; }
        public ICollection<Contestor> TournamentContestor { get; set; }
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();

    }
}