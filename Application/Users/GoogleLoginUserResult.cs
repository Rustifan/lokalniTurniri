namespace Application.Users
{
    public class GoogleLoginUserResult
    {
        public bool IsSucess { get; set; }
        public string Error { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Picture { get; set; }
        public static GoogleLoginUserResult Sucess(string username, string email, string picture)
        {
            return new GoogleLoginUserResult
            {
                IsSucess = true,
                Error = null,
                Username = username,
                Email = email,
                Picture = picture
            };
        }

        public static GoogleLoginUserResult Failed(string error)
        {
            return new GoogleLoginUserResult
            {
                IsSucess = false,
                Error = error
            };
        }
    }
}