using Microsoft.AspNetCore.Http;

namespace Application.Extensions
{
    public static class HttpExtensions
    {
        public static HttpResponse AddHeders(this HttpResponse response, string headerKey, string headerValue)
        {
            response.Headers.Add(headerKey, headerValue);
            response.Headers.Add("Access-Control-Expose-Headers", headerValue);
            return response;
        }
    }
}