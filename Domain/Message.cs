using System;

namespace Domain
{
    public class Message
    {
        public Guid Id { get; set; }
        public string MessageText { get; set; }
        public string SenderId { get; set; }
        public AppUser Sender { get; set; }
        public string ReceiverId { get; set; }
        public AppUser Receiver { get; set; }
        public bool Read { get; set; }
        public DateTime TimeOfSending { get; set; } = DateTime.Now;
    }
}