using Application.Tournaments;
using AutoMapper;
using Domain;
using System.Linq;

namespace Application.Core
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<TournamentEditDto, Tournament>();
            CreateMap<AppUser, Profiles.Profile>();
            CreateMap<Tournament, TournamentDto>()
                .ForMember(x=>x.Admins, o=>o.MapFrom(a=>a.Admins.Select(x=>x.User.UserName)))
                .ForMember(x=>x.HostUsername, o=>o.MapFrom(h=>h.Host.UserName));
        }
    }
}