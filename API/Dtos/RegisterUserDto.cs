using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterUserDto
    {   
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [RegularExpression("(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,16}", ErrorMessage = "Lozinka mora biti kompleksna")]
        public string Password { get; set; }
    }
}