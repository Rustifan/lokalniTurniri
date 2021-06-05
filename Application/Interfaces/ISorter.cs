using System.Collections.Generic;
using Application.Tournaments;

namespace Application.Interfaces
{
    public interface ISorter
    {
        IEnumerable<TournamentDto> SortContestorsInTournamentDto(IEnumerable<TournamentDto> tournaments);

        List<ContestorDto> SortContestorDtos(List<ContestorDto> contestors);


    }
}