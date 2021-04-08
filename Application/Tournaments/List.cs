using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace Application.Tournaments
{
    public class List
    {
        public class Query: IRequest<Result<List<Tournament>>>
        {
            
        }

        public class Handler : IRequestHandler<Query, Result<List<Tournament>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<List<Tournament>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournaments = await _context.Tournaments.ToListAsync();
                if(tournaments == null) return null;
                return Result<List<Tournament>>.Success(tournaments);
            }
        }


    }
}