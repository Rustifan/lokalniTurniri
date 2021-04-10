using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
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

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }
            public async Task<Result<TournamentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync(x=>x.Id ==request.Id, cancellationToken);
                    
                if(tournament == null) return null;

                return Result<TournamentDto>.Success(tournament);
            }
        }
    }
}