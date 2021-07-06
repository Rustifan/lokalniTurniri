using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ResetPasswordDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Token { get; set; }
        
        [Required]
        [RegularExpression("(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,16}", ErrorMessage = "Lozinka mora biti kompleksna")]
        public string Password { get; set; }

        [Required]
        [Compare(nameof(Password), ErrorMessage = "Lozinke moraju biti iste")]
        public string RepeatPassword { get; set; }
    }
}