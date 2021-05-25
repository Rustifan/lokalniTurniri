using Domain;

namespace Application.Messages
{
    public class SendMessageResult
    {
        public string Error { get; set; }
        public bool IsSuccess { get; set; }
        public MessageDto Message { get; set; }
        public static SendMessageResult Success(MessageDto message)
        {
            return new SendMessageResult{IsSuccess=true, Error=null, Message=message};
        }

        public static SendMessageResult Failed(string error)
        {
            return new SendMessageResult{IsSuccess=false, Error=error, Message=null};
        }
    }
}