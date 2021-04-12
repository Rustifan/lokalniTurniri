using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class AddResultToActiveGame
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid GameId { get; set; }
            public int Result { get; set; }
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
                var game = await _context.Games
                    .Include(x=>x.Contestor1)
                    .Include(x=>x.Contestor2)
                    .FirstOrDefaultAsync(x=>x.Id == request.GameId, cancellationToken);
                if(request.Result < 0 || request.Result >2) return Result<Unit>.Failed("Result must be 0, 1 or 2");
                if(game == null) return null;
                if(game.Result == request.Result) return Result<Unit>.Failed("Result is already "+ game.Result);
                if(game.Result != -1)
                {
                    switch(game.Result)
                    {
                        case 0:
                        game.Contestor1.Draws--;
                        game.Contestor2.Draws--;
                        break;
                    case 1:
                        game.Contestor1.Wins--;
                        game.Contestor2.Loses--;
                        break;
                    case 2:
                        game.Contestor1.Loses--;
                        game.Contestor2.Wins--;
                        break;
                    }
                }
                game.Result = request.Result;

                
                switch(request.Result)
                {
                    case 0:
                        game.Contestor1.Draws++;
                        game.Contestor2.Draws++;
                        break;
                    case 1:
                        game.Contestor1.Wins++;
                        game.Contestor2.Loses++;
                        break;
                    case 2:
                        game.Contestor1.Loses++;
                        game.Contestor2.Wins++;
                        break;
                        
                }


                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Something went wrong while saving to database");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}