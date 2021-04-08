using System;

namespace Domain
{
    public class Tournament
    {
        public Guid Id { get; set; }
        public string Sport { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        
    }
}