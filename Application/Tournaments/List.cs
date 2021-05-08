using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using Application.Interfaces;

namespace Application.Tournaments
{
    public class List
    {
        public class Query: IRequest<Result<List<TournamentDto>>>
        {
            
        }

        public class Handler : IRequestHandler<Query, Result<List<TournamentDto>>>
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
            public async Task<Result<List<TournamentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournaments = await _context.Tournaments
                 .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                
                if(tournaments == null) return null;

                tournaments = _sorter.SortContestorsInTournamentDto(tournaments);

                return Result<List<TournamentDto>>.Success(tournaments);
            }
        }


    }
}