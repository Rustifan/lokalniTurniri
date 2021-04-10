using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Validation;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;
using Microsoft.AspNetCore.Identity;

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
            private readonly IUserAccessor _userAccessor;
            private readonly UserManager<AppUser> _userManager;
            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }

                    
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(_userAccessor.GetUsername());
                if(user == null) return null;
                request.Tournament.Host = user;
                request.Tournament.Admins.Add(new Admin
                {
                    Tournament = request.Tournament,
                    User = user
                });
                _context.Tournaments.Add(request.Tournament);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failed("Failed to save tournament to database");
            }
        }
    }
}