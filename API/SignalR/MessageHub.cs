using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Application.Messages;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub: Hub
    {
        private readonly ILogger<MessageHub> _logger;
        private readonly IUserAccessor _userAccessor;
        private readonly IMediator _mediator;

        public MessageHub(ILogger<MessageHub> logger, IUserAccessor userAccessor, IMediator mediator)
        {
            _logger = logger;
           _userAccessor = userAccessor;
           _mediator = mediator;
        }
        public async override Task OnConnectedAsync()
        {
            var username = _userAccessor.GetUsername();
            await Groups.AddToGroupAsync(Context.ConnectionId, username);
            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            var username = _userAccessor.GetUsername();
            Groups.RemoveFromGroupAsync(Context.ConnectionId, username);


            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string receiver, string message)
        {
            var result = await _mediator.Send(new SendMessage.Command{Receiver = receiver, Message=message});
            if(!result.IsSuccess) 
            {
                await Clients.Caller.SendAsync("sendMessageError", result.Error);
                return;
            }
            await Clients.Groups(receiver, result.Message.Sender).SendAsync("receiveMessage", result.Message);


            

        }
    }
}