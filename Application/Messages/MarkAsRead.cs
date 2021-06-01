using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class MarkAsRead
    {
        public class Command: IRequest<bool>
        {
            public string Interlocutor { get; set; }
        }

        public class Handler: IRequestHandler<Command, bool>
        {

            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
            {
                var messages = await _context.Messages
                    .Include(x=>x.Receiver)
                    .Include(x=>x.Sender)
                    .Where(x=>x.Sender.UserName == request.Interlocutor &&
                        x.Receiver.UserName == _userAccessor.GetUsername())
                    .ToListAsync(cancellationToken);
                
                foreach (var message in messages)
                {
                    message.Read = true;
                }

                var result = await _context.SaveChangesAsync(cancellationToken) > 0;

                if(result) return true;

                return false;
                    
              
            }
        }
    }
}