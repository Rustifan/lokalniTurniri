using System.Collections.Generic;
using Application.Tournaments;
using System.Linq;
using Application.Interfaces;

namespace Application.Helpers
{
    public class Sorter: ISorter
    {
        public IEnumerable<TournamentDto> SortContestorsInTournamentDto(IEnumerable<TournamentDto> tournaments)
        {
            

            foreach(var tournament in tournaments)
            {
                tournament.Contestors = SortContestorDtos(tournament.Contestors);
            }

            return tournaments;
        }        

        public List<ContestorDto> SortContestorDtos(List<ContestorDto> contestors)
        {
            var sortedContestors = contestors.OrderByDescending(x=>x.Score).ThenBy(x=>x.Rating);

            return sortedContestors.ToList();
        }
    }
}