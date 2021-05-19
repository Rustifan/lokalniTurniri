using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ChangePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }
        
        [Required]
        public string NewPassword { get; set; }
        
        [RegularExpression("(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,16}", ErrorMessage = "Lozinka mora biti kompleksna")]
        public string RepeatPassword { get; set; }
    }
}