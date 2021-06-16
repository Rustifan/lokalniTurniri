using System;

namespace Domain
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public string Token { get; set; }
        public AppUser User { get; set; }
        public DateTime Expiery { get; set; } = DateTime.Now.AddDays(7);
        public bool Revoked { get; set; } = false;
        public bool IsActive => !Revoked && DateTime.Now <= Expiery;
    }
}