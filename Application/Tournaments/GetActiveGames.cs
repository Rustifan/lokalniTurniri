using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class GetActiveGames
    {
        public class Query: IRequest<Result<List<GameDto>>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<GameDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<GameDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .Include(x=>x.Games).ThenInclude(x=>x.Contestor1)
                    .Include(x=>x.Games).ThenInclude(x=>x.Contestor2)
                    .FirstAsync(x=>x.Id == request.Id, cancellationToken);
                if(tournament == null) return null;

                var games = tournament.Games.Where(x=>x.Result == -1).ToList();
                var gameDtos = _mapper.Map<List<Game>, List<GameDto>>(games);
                return Result<List<GameDto>>.Success(gameDtos);

            }
        }
    }
}