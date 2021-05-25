using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class SendMessage
    {
        public class Command : IRequest<SendMessageResult>
        {
            public string Receiver { get; set; }
            public string Message { get; set; }
        }

        public class Handler : IRequestHandler<Command, SendMessageResult>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                _context = context;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<SendMessageResult> Handle(Command request, CancellationToken cancellationToken)
            {
                var sender = await _context.Users
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername(), cancellationToken);
                if (sender == null) return SendMessageResult.Failed("Could not find sender");

                var receiver = await _context.Users
                    .FirstOrDefaultAsync(x => x.UserName == request.Receiver, cancellationToken);
                if (receiver == null) return SendMessageResult.Failed("Could not find receiver");

                var message = new Message
                {
                    Id = Guid.NewGuid(),
                    Sender = sender,
                    Receiver = receiver,
                    MessageText = request.Message,
                    Read = false,
                    TimeOfSending = DateTime.Now
                };

                _context.Messages.Add(message);
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if (!result) return SendMessageResult.Failed("Problem saving message to database");

                return SendMessageResult.Success(_mapper.Map<MessageDto>(message));

            }
        }
    }
}