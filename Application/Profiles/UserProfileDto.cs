using System.Collections.Generic;
using Domain;

namespace Application.Profiles
{
    public class UserProfileDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Bio { get; set; }
        public string Avatar { get; set; }
        public List<Image> Images { get; set; }

    }
}