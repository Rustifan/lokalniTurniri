using Application.Profiles;
using FluentValidation;

namespace Application.Validation
{
    public class EditProfileValidator: AbstractValidator<EditProfileDto>
    {
        public EditProfileValidator()
        {
            RuleFor(x=>x.Username).NotEmpty();
            RuleFor(x=>x.Email).NotEmpty();
            
        }
    }
}