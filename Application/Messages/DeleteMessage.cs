using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class DeleteMessage
    {
        public class Command: IRequest<DeleteMessageResult>
        {
            public Guid MessageId { get; set; }
        }

        public class Handler : IRequestHandler<Command, DeleteMessageResult>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<DeleteMessageResult> Handle(Command request, CancellationToken cancellationToken)
            {
                var message = await _context.Messages
                    .Include(x=>x.Sender)
                    .Include(x=>x.Receiver)
                    .FirstOrDefaultAsync(x=>x.Id==request.MessageId, cancellationToken);
                if(message==null) return DeleteMessageResult.Failed("Could not find message");

                if(message.Sender.UserName != _userAccessor.GetUsername()) return DeleteMessageResult.Failed("User is not sender of message"); 

                _context.Messages.Remove(message);

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return DeleteMessageResult.Failed("Something went wrong while deleting from database");

                return DeleteMessageResult.Sucess(message.Receiver.UserName);
            }
        }
    }
}