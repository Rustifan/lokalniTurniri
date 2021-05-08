using System.Collections.Generic;
using Application.Tournaments;

namespace Application.Interfaces
{
    public interface ISorter
    {
        List<TournamentDto> SortContestorsInTournamentDto(List<TournamentDto> tournaments);

        List<ContestorDto> SortContestorDtos(List<ContestorDto> contestors);


    }
}