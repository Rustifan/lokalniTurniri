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
    public class Delete
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid ImageId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;

            private readonly DataContext _context;
            private readonly IImageUploader _imageUploader;
            public Handler(DataContext context, IUserAccessor userAccessor, IImageUploader imageUploader )
            {
                _userAccessor = userAccessor;
                _context = context;
                _imageUploader = imageUploader;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                    .Include(x=>x.Images)
                    .FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUsername(), cancellationToken);
                if(user == null) return Result<Unit>.Failed("User could not be found");

                var image = user.Images.FirstOrDefault(x=>x.Id == request.ImageId);
                if(image == null) return null;

                user.Images.Remove(image);
                
                if(user.Avatar == image.Url) user.Avatar = null;

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Somethin went wrong while deleting from database");
                
                var deletingResult = await _imageUploader.DeleteImage(image.PublicId);
                if(deletingResult != "ok") return Result<Unit>.Failed(deletingResult);

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}