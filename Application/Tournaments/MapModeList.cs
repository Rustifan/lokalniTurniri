using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tournaments
{
    public class MapModeList
    {
        public class Query: IRequest<Result<List<TournamentDto>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<TournamentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ISorter _sorter;
            public Handler(DataContext context,  IMapper mapper, ISorter sorter)
            {
                _context = context;
                _mapper = mapper;
                _sorter = sorter;
            }
            public async Task<Result<List<TournamentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournamentList = await _context.Tournaments
                    .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);
                    
                tournamentList = (List<TournamentDto>)_sorter.SortContestorsInTournamentDto(tournamentList);

                return Result<List<TournamentDto>>.Success(tournamentList);


            }
        }
    }
}