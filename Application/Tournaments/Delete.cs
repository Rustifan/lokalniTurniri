using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class Delete
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var tournament = await _context.Tournaments.FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);
                if(tournament == null) return null;

                _context.Tournaments.Remove(tournament);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if(!result) return Result<Unit>.Failed("Failed to delete tpurnament");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}