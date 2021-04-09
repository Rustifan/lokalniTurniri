using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Tournament, Tournament>();
            CreateMap<AppUser, Profiles.Profile>();
        }
    }
}