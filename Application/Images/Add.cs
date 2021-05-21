using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class Add
    {
        public class Command: IRequest<Result<Image>>
        {
            public IFormFile Image { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Image>>
        {
            private readonly DataContext _context;
            private readonly IImageUploader _imageUploader;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IImageUploader imageUploader, IUserAccessor userAccessor)
            {
                _context = context;
                _imageUploader = imageUploader;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Image>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x=>x.UserName == _userAccessor.GetUsername(), cancellationToken);
                if(user == null) return Result<Image>.Failed("Could not find user");
                
                var image = await _imageUploader.UploadImage(request.Image);
                if(image == null) return Result<Image>.Failed("Problem with uploading image");

                if(user.Avatar == null) user.Avatar = image.Url;
                user.Images.Add(image);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0; 
                if(!result) return Result<Image>.Failed("Problem saving to database");

                return Result<Image>.Success(image);
            }
        }
    }
}