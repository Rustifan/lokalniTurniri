using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Users;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.LoginServices
{
    public class GoogleLoginService: IGoogleLoginService
    {
        private readonly ILogger<GoogleLoginService> _logger;
        private readonly IConfiguration _configuration;
        public GoogleLoginService(ILogger<GoogleLoginService> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<GoogleLoginUserResult> ValidateToken(string token)
        {
            var googleId = _configuration["Google:GoogleId"];
            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience= new List<string>{googleId},
                
            
            };

            try
            {
                var validPayload = await GoogleJsonWebSignature.ValidateAsync(token, settings);
                return GoogleLoginUserResult.Sucess(validPayload.Name, validPayload.Email, validPayload.Picture);

            }
            catch(InvalidJwtException exception)
            {
                _logger.LogError(exception.Message);
                return GoogleLoginUserResult.Failed(exception.Message);
            }
                   
            
        } 
    }
}