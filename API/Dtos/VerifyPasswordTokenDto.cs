using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class VerifyPasswordTokenDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Token { get; set; }
    }
}