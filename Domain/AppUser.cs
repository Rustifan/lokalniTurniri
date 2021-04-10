using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser: IdentityUser
    {
        public ICollection<Admin> TournamentsAdmin { get; set; }
    }
}