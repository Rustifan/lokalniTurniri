using System.Threading.Tasks;
using Application.Users;

namespace Application.Interfaces
{
    public interface IGoogleLoginService
    {
        Task<GoogleLoginUserResult> ValidateToken(string token);
    }
}