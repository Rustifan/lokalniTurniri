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
    public class AddAdmin
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public string AdminName { get; set; }
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
                    .Include(x=>x.Admins).ThenInclude(x=>x.User)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);

                if(tournament == null) return null;

                
                var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == request.AdminName, cancellationToken);

                if(user == null) return Result<Unit>.Failed("Nema korisnika sa tim imenom");

                if(tournament.Admins.Any(x=>x.User.UserName == user.UserName)) return Result<Unit>.Failed(user.UserName+ " je već administrator");

                tournament.Admins.Add(new Admin
                {
                    Tournament = tournament,
                    User = user
                });

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Failed to update database");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }

}