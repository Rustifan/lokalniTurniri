using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;
using System.Linq;
using System;
using Microsoft.Extensions.Logging;
using Application.Extensions;

namespace Application.Tournaments
{
    public class List
    {
        public class Query : IRequest<PaginatedList<TournamentDto>>
        {
            public TournamentLoadParams LoadParams { get; set; }
        }

        public class Handler : IRequestHandler<Query, PaginatedList<TournamentDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ISorter _sorter;
            private readonly IUserAccessor _userAccessor;
            private readonly ILogger<Handler> _logger;
            public Handler(DataContext context, IMapper mapper, 
                ISorter sorter, IUserAccessor userAccessor, ILogger<Handler> logger)
            {
                _context = context;
                _mapper = mapper;
                _sorter = sorter;
                _userAccessor = userAccessor;
                _logger = logger;
            }
            public async Task<PaginatedList<TournamentDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var tournamentQuery = _context.Tournaments
                    .ProjectTo<TournamentDto>(_mapper.ConfigurationProvider);
                    
               
                string username = null;
                try
                {
                    username = _userAccessor.GetUsername();
                }
                catch(Exception)
                {
                    _logger.LogInformation("User is guest");
                }
                
                tournamentQuery = tournamentQuery.FilterByContesting(request.LoadParams.ContestingFilter, username);
                
                tournamentQuery = tournamentQuery.FilterByFlow(request.LoadParams.FlowFilter);

                tournamentQuery = tournamentQuery.Where(x=>x.Date >= request.LoadParams.Date);
                

                tournamentQuery = tournamentQuery.OrderBy(x => x.Date);
                var paginatedList = await PaginatedList<TournamentDto>.ToPaginatedListAsync(
                    tournamentQuery, 
                    request.LoadParams.CurrentPage,
                    request.LoadParams.ItemsPerPage);

                paginatedList = (PaginatedList<TournamentDto>)_sorter.SortContestorsInTournamentDto(paginatedList);

                return paginatedList;
            }
        }


    }
}