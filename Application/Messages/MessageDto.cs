using System;

namespace Application.Messages
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string Sender { get; set; }
        public string Receiver { get; set; }
        public bool Read { get; set; }
        public DateTime TimeOfSending { get; set; }
        public string MessageText { get; set; }
        

    }
}