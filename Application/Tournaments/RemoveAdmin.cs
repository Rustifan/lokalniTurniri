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
    public class RemoveAdmin
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public string AdminName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
          

            public Handler(DataContext context)
            {
                _context = context;
                
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .Include(x=>x.Host)
                    .Include(x=>x.Admins).ThenInclude(x=>x.User)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);
                
                if(tournament.Host.UserName == request.AdminName) return Result<Unit>.Failed("You cannot remove host from Admin list");
                if(tournament == null) return null;

                var user = tournament.Admins.FirstOrDefault(x=>x.User.UserName==request.AdminName);
                if(user == null) return null;

                tournament.Admins.Remove(user);
                
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Failed to update database");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }

}
