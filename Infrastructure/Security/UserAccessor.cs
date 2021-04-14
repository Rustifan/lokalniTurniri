using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;



namespace Infrastructure.Security
{
    public class UserAccessor: IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;

        }
        public string GetUsername()
        {
            var username = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name);
            return username.Value;

        }
    }
}