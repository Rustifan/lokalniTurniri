using Domain;
using FluentValidation;

namespace Application.Validation
{
    public class TournamentValidator: AbstractValidator<Tournament>
    {
        public TournamentValidator()
        {
            RuleFor(x=>x.Sport).NotEmpty();
            RuleFor(x=>x.Location).NotEmpty();
            RuleFor(x=>x.Date).NotEmpty();

        }
    }
}