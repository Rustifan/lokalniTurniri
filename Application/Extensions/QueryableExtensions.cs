using System.Linq;
using Application.Tournaments;

namespace Application.Extensions
{
    public static class QueryableExtensions
    {
        public static IQueryable<TournamentDto> FilterByContesting(this IQueryable<TournamentDto> query, 
            TournamentContestingFilterEnum contestingFilter, string contestorUsername)
            {
                switch(contestingFilter)
                {
                    case TournamentContestingFilterEnum.Contestor:
                    if(contestorUsername == null) break;
                    query = query
                        .Where(x=>x.Contestors.Any(x=>x.Username==contestorUsername));
                    break;
                    case TournamentContestingFilterEnum.Administrator:
                    
                    if(contestorUsername == null) break;
                    query = query
                        .Where(x=>x.Admins.Any(x=>x==contestorUsername));
                    break;
                }  

                return query;
            }

        public static IQueryable<TournamentDto> FilterByFlow(this IQueryable<TournamentDto> query,
        TournamentFlowFilterEnum flowFilter)
        {
            switch(flowFilter)
            {
                case TournamentFlowFilterEnum.OpenApplications:
                query = query
                    .Where(x=>!x.ApplicationsClosed);
                break;
                case TournamentFlowFilterEnum.inProcess:
                    query = query
                    .Where(x=>x.IsInProcess);
                break;
                case TournamentFlowFilterEnum.Ended:
                    query = query
                    .Where(x=>x.Ended);
                break;
            }

            return query;
        }
    }
}