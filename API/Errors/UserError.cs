namespace API.Errors
{
    public class UserError
    {
        public bool IsUserError { get; } = true;
        public string Message { get; set; }
        public UserError(string message)
        {
            Message = message;
        }
        
    }

}