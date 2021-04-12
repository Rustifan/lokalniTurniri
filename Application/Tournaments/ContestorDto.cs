namespace Application.Tournaments
{
    public class ContestorDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public int Rating {get; set;}
        public int Wins { get; set; }
        public int Loses { get; set; }
        public int Draws { get; set; }
        public float Score { get; set; }
    }
}