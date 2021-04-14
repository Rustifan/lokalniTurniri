using System;

namespace Application.Tournaments
{
    public class GameDto
    {
        public Guid Id { get; set; }
        public string Contestor1 { get; set; }
        public string Contestor2 { get; set; }
        public int Result { get; set; }
        public bool Active=>Result == -1; 
        public int Round { get; set; }
    }
}