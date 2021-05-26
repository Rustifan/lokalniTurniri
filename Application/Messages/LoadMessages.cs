using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class LoadMessages
    {
        public class Query: IRequest<Dictionary<string, List<MessageDto>>>
        {

        }

        public class Handler: IRequestHandler<Query, Dictionary<string, List<MessageDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }
            public async Task<Dictionary<string, List<MessageDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                
                var username = _userAccessor.GetUsername();

                var messages = await _context.Messages
                    .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                    .Where(x=>x.Sender == username || x.Receiver == username)
                    .OrderBy(x=>x.TimeOfSending)
                    .ToListAsync(cancellationToken);

                var messagesByInterlocutor = new Dictionary<string, List<MessageDto>>();
                
                foreach (var message in messages)
                {
                    string interlocutor = message.Sender == username ? message.Receiver : message.Sender;
                    if(!messagesByInterlocutor.ContainsKey(interlocutor))
                    {
                        messagesByInterlocutor.Add(interlocutor, new List<MessageDto>());
                    }
                    messagesByInterlocutor[interlocutor].Add(message);
                }

                return messagesByInterlocutor;
                



            }
        }


    }
}