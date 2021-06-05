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
using Application.Interfaces;
using System.Linq;

namespace Application.Tournaments
{
    public class List
    {
        public class Query : IRequest<PaginatedList<TournamentDto>>
        {
            public PageParams PageParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, PaginatedList<TournamentDto>>
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
            public async Task<PaginatedList<TournamentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournamentQuery = _context.Tournaments
                    .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider)
                    .OrderBy(x => x.Date);

                var paginatedList = await PaginatedList<TournamentDto>.ToPaginatedListAsync(
                    tournamentQuery, 
                    request.PageParams.CurrentPage,
                    request.PageParams.ItemsPerPage);

                paginatedList = (PaginatedList<TournamentDto>)_sorter.SortContestorsInTournamentDto(paginatedList);

                return paginatedList;
            }
        }


    }
}