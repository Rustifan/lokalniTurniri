namespace API.Errors
{
    public class UserError
    {
        public bool IsUserError { get; } = true;
        public bool EmailNotConfirmed {get; set;} = false;
        public string Email { get; set; }
        public string Message { get; set; }
        public UserError(string message)
        {
            Message = message;
        }
        public static UserError EmailNotConfirmedError(string email, string message="Email nije potvrđen")
        {
            var error = new UserError(message)
            {
                EmailNotConfirmed = true,
                Email = email
            };
         
            return error;
        }
    }

}