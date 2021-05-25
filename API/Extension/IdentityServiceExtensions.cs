using Domain;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Persistence;
using API.Services;
using Application.Interfaces;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Infrastructure.Security;
using System.Threading.Tasks;

namespace API.Extension
{
    public static class IdentitiyServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddScoped<ITokenService, TokenService>();

            services.AddIdentityCore<AppUser>(opt=>
            {
                opt.Password.RequireDigit = false;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequiredLength = 8;
                opt.Password.RequiredUniqueChars = 0;
                opt.Password.RequireUppercase = true;

                opt.SignIn.RequireConfirmedEmail = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();
            
            string secret = config["JwtTokenSecret"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options=>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = false,
                        IssuerSigningKey = securityKey

                    };
                    
                    options.Events = new JwtBearerEvents
                    {
                        //SignlR token acces
                        
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            
                            var path = context.HttpContext.Request.Path;
                            if(!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/api/messageHub"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });
                
                
            
            services.AddAuthorization(opt=>
            {
                opt.FallbackPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                opt.AddPolicy("IsHostRequirement", policy=>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
                opt.AddPolicy("IsAdminRequirement", policy=>
                {
                    policy.Requirements.Add(new IsTournamentAdminReqirement());
                });
                opt.AddPolicy("IsGameAdminRequirement", policy=>
                {
                    policy.Requirements.Add(new IsGameTournamentAdminRequirement());
                });
            });

            services.AddScoped<IAuthorizationHandler, IsTournamentHost>();
            services.AddScoped<IAuthorizationHandler, IsTournamentAdminHandler>();
            services.AddScoped<IAuthorizationHandler, IsGameTournamentAdminHandler>();
            return services;
        }
    }
}