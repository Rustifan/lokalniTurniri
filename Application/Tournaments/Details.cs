using System;
using System.Linq;
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
    public class Details
    {
        public class Query: IRequest<Result<TournamentDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<TournamentDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ISorter _sorter;

            public Handler(DataContext context, IMapper mapper, ISorter sorter)
            {
                _context = context;
                _mapper = mapper;
                _sorter = sorter;
            }
            public async Task<Result<TournamentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x=>x.Id ==request.Id, cancellationToken);
                    
                if(tournament == null) return null;
                
                tournament.Contestors = _sorter.SortContestorDtos(tournament.Contestors);
                
                return Result<TournamentDto>.Success(tournament);
            }
        }
    }
}