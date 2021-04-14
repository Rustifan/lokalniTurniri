using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class CloseApplications
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler: IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments.FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);
                if(tournament == null) return null;

                if(tournament.CurrentRound > 0) return Result<Unit>.Failed("Tournament already started");

                tournament.ApplicationsClosed = !tournament.ApplicationsClosed;
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if(!result) return Result<Unit>.Failed("Problem while saving to database");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}