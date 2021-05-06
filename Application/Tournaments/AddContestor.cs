using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class AddContestor
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string Name { get; set; }
            public bool IsGuest { get; set; }
            public Guid Id { get; set; }

        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, UserManager<AppUser> userManager)
            {
                _context = context;
                _userManager = userManager;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .Include(x=>x.Contestors)
                    .ThenInclude(x=>x.AppUser)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);

                if(tournament == null) return null;

                if(tournament.ApplicationsClosed) return Result<Unit>.Failed("Applications are closed");

                if(request.IsGuest)
                {
                    if( await _userManager.FindByNameAsync(request.Name)!=null)
                    {
                        return Result<Unit>.Failed("User with that name already exist");
                    }

                    var contestor = tournament.Contestors.FirstOrDefault(x=>x.DisplayName == request.Name);
                    if(contestor == null)
                    {
                        contestor = new Contestor
                        {
                            Tournament= tournament,
                            DisplayName = request.Name,
                            AppUser = null
                        
                        };
                        tournament.Contestors.Add(contestor);
                    }
                    else
                    {
                        tournament.Contestors.Remove(contestor);
                    }
                   
                }
                else
                {
                    
                    var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == request.Name,cancellationToken);
                    
                    if(user == null) return Result<Unit>.Failed("Ne postoji korisnik sa tim imenom");

                    var contestor = tournament.Contestors.FirstOrDefault(x=>x.DisplayName == request.Name);
                    if(contestor == null)
                    {
                        contestor = new Contestor
                        {
                            Tournament = tournament,
                            DisplayName = user.UserName,
                            AppUser = user
                        };
                        tournament.Contestors.Add(contestor);
                    }
                    else
                    {
                        tournament.Contestors.Remove(contestor);
                    }

                   
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Failed to update database");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}