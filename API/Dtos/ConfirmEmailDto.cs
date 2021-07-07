using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ConfirmEmailDto
    {
        [Required]
        public string Email { get; set; }
        
        [Required]
        public string Token { get; set; }
    }
}