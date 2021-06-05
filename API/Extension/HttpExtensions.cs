using Microsoft.AspNetCore.Http;

namespace API.Extension
{
    public static class HttpExtensions
    {
        public static HttpResponse AddHeaders(this HttpResponse response, string headerKey, string headerValue)
        {
            response.Headers.Add(headerKey, headerValue);
            response.Headers.Append("Access-Control-Expose-Headers", headerKey);
       
            return response;
        }
    }
}