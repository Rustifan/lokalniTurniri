using Application.Tournaments;
using FluentValidation;

namespace Application.Validation
{
    public class  TournamentEditDtoValidator: AbstractValidator<TournamentEditDto>
    {
        public TournamentEditDtoValidator()
        {
            RuleFor(x=>x.Location).NotEmpty();
            RuleFor(x=>x.Sport).NotEmpty();
            RuleFor(x=>x.Date).NotEmpty();
            RuleFor(x=>x.Name).NotEmpty();
        }
    }
}