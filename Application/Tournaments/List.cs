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
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<List<TournamentDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournaments = await _context.Tournaments
                 .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

                
                if(tournaments == null) return null;
                return Result<List<TournamentDto>>.Success(tournaments);
            }
        }


    }
}