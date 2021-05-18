using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
    public class EditProfile
    {
        public class Command: IRequest<Result<UserDto>>
        {
            public EditProfileDto EditDto { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<UserDto>>
        {
            private readonly IMapper _mapper;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly ITokenService _tokenService;
            public Handler(IMapper mapper, UserManager<AppUser> userManager, IUserAccessor userAccessor, ITokenService tokenService)
            {
                _mapper = mapper;
                _userManager = userManager;
                _userAccessor = userAccessor;
                _tokenService = tokenService;
            }
            public async Task<Result<UserDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                string username = _userAccessor.GetUsername();
                
                var user = await _userManager.Users.FirstOrDefaultAsync(x=>x.UserName == username, cancellationToken);
                if(user == null) return null;
                
                if(request.EditDto.Username != user.UserName)
                {
                    var sameUsername = await _userManager.Users.AnyAsync(x=>x.UserName == request.EditDto.Username, cancellationToken);
                    if(sameUsername) return Result<UserDto>.Failed("Korisničko ime je zauzeto");
                }
                if(request.EditDto.Email != user.Email)
                {
                    var sameEmail = await _userManager.Users.AnyAsync(x=>x.Email == request.EditDto.Email, cancellationToken);
                    if(sameEmail) return Result<UserDto>.Failed("Email je već zauzet");
                }

                _mapper.Map(request.EditDto, user);
                
                var result = await _userManager.UpdateAsync(user);
                if(!result.Succeeded) return Result<UserDto>.Failed("Problem Updating user");
                
                

                return Result<UserDto>.Success(new UserDto
                {
                    Email = user.Email,
                    Username = user.UserName,
                    Token = _tokenService.CreateToken(user)
                });                   
                
            }
        }
    }
}