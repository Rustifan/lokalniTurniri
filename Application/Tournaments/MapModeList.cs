using System;
using System.Collections.Generic;
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
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Tournaments
{
    public class MapModeList
    {
        public class Query: IRequest<Result<List<TournamentDto>>>
        {
            public TournamentLoadParams LoadParams { get; set; }
            
        }

        public class Handler : IRequestHandler<Query, Result<List<TournamentDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ISorter _sorter;
            private readonly ILogger<Handler> _logger;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context,  IMapper mapper, 
                ISorter sorter, ILogger<Handler> logger, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _sorter = sorter;
                _logger = logger;
                _userAccessor = userAccessor;
            }
            public async Task<Result<List<TournamentDto>>> Handle(Query request, CancellationToken cancellationToken)
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
               
                switch(request.LoadParams.ContestingFilter)
                {
                    case TournamentContestingFilterEnum.Contestor:
                    if(username == null) return null;
                    tournamentQuery = tournamentQuery
                        .Where(x=>x.Contestors.Any(x=>x.Username==username));
                    break;
                    case TournamentContestingFilterEnum.Administrator:
                    
                    if(username == null) return null;
                    tournamentQuery = tournamentQuery
                        .Where(x=>x.Admins.Any(x=>x==username));
                    break;
                }  
            

                switch(request.LoadParams.FlowFilter)
                {
                    case TournamentFlowFilterEnum.OpenApplications:
                    tournamentQuery = tournamentQuery
                        .Where(x=>!x.ApplicationsClosed);
                    break;
                    case TournamentFlowFilterEnum.inProcess:
                        tournamentQuery = tournamentQuery
                        .Where(x=>x.IsInProcess);
                    break;
                    case TournamentFlowFilterEnum.Ended:
                        tournamentQuery = tournamentQuery
                        .Where(x=>x.Ended);
                    break;
                }
                tournamentQuery = tournamentQuery.Where(x=>x.Date >= request.LoadParams.Date);

                
                var tournamentList = await tournamentQuery.ToListAsync(cancellationToken);


                tournamentList = (List<TournamentDto>)_sorter.SortContestorsInTournamentDto(tournamentList);

                return Result<List<TournamentDto>>.Success(tournamentList);


            }
        }
    }
}