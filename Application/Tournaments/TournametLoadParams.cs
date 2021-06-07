using System;

namespace Application.Tournaments
{
    public class TournamentLoadParams : PageParams
    {
        public TournamentContestingFilterEnum ContestingFilter { get; set; } = TournamentContestingFilterEnum.All;
        public TournamentFlowFilterEnum FlowFilter { get; set; } = TournamentFlowFilterEnum.All;
        public bool MapMode { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}