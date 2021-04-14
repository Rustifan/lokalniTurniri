namespace Application.Core
{
    public class AppException
    {
        public string Error { get; set; }
        public string ErrorDetails { get; set; }
        public int StatusCode { get; set; }

        public AppException(string error, int statusCode, string errorDetails = null)
        {
            Error = error;
            ErrorDetails = errorDetails;
            StatusCode = statusCode;
        }

    }
}