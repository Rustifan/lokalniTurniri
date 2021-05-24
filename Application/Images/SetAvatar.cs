using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class SetAvatar
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid ImageId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .Include(x=>x.Images)
                    .FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUsername(), cancellationToken);
                if(user == null) return Result<Unit>.Failed("Coul not find user");

                var image = user.Images.FirstOrDefault(x=>x.Id == request.ImageId);
                if(image == null) return null;

                if(image.Url == user.Avatar) return Result<Unit>.Failed("Selected Image is already avatar");

                user.Avatar = image.Url;

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Something went wrong while saving to database");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}