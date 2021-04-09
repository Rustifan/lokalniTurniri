using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Validation;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Tournaments
{
    public class Create
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Tournament Tournament { get; set; }
        }

        public class CreateValidator: AbstractValidator<Command>
        {
            public CreateValidator()
            {
                RuleFor(x=>x.Tournament).SetValidator(new TournamentValidator());
            }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Tournaments.Add(request.Tournament);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failed("Failed to save tournament to database");
            }
        }
    }
}