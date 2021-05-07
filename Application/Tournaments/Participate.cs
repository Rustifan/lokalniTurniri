using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class Participate
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetUsername());
                if(user == null) return Result<Unit>.Failed("User not found");

                var tournament = await _context.Tournaments
                    .Include(x=>x.Contestors)
                    .ThenInclude(x=>x.AppUser)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);

                if(tournament == null) return null;

                if(tournament.ApplicationsClosed) return Result<Unit>.Failed("Applicatons are closed");
                
                var contestor = tournament.Contestors.FirstOrDefault(x=>x.AppUser?.UserName == user.UserName);
                if(contestor != null)
                {
                    tournament.Contestors.Remove(contestor);
                }
                else
                {
                    contestor = new Contestor
                    {
                        AppUser = user,
                        DisplayName = user.UserName,
                        Tournament = tournament
                    };
                    tournament.Contestors.Add(contestor);
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Failed to save changes to database");


                return Result<Unit>.Success(Unit.Value);

            }
        }
    }
}