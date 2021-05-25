using Application.Messages;
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
            CreateMap<AppUser, Profiles.UserProfileDto>();
            CreateMap<Profiles.EditProfileDto, AppUser>();

            CreateMap<Tournament, TournamentDto>()
                .ForMember(x=>x.Admins, o=>o.MapFrom(a=>a.Admins.Select(x=>x.User.UserName)))
                .ForMember(x=>x.Games, o=>o.MapFrom(x=>x.Games.OrderBy(x=>x.Round).ThenBy(x=>x.GameNumber)))
                .ForMember(x=>x.HostUsername, o=>o.MapFrom(h=>h.Host.UserName))
                .ForMember(x=>x.ContestorNum, o=>o.MapFrom(x=>x.Contestors.Count));
            CreateMap<Contestor, ContestorDto>()
                .ForMember(x=>x.Username, o=>o.MapFrom(x=>x.AppUser!=null? x.AppUser.UserName:null));
            CreateMap<Game, GameDto>()
                .ForMember(x=>x.Contestor1, o=>o.MapFrom(x=>x.Contestor1.DisplayName))
                .ForMember(x=>x.Contestor2, o=>o.MapFrom(x=>x.Contestor2.DisplayName));

            CreateMap<Message, MessageDto>()
                .ForMember(x=>x.Sender, o=>o.MapFrom(x=>x.Sender.UserName))
                .ForMember(x=>x.Receiver, o=>o.MapFrom(x=>x.Receiver.UserName));
        }      
    }
}