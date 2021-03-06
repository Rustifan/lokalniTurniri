using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;
using MediatR;
using FluentValidation.AspNetCore;
using AutoMapper;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using Application.Helpers;
using Infrastructure.ImageUpload;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Infrastructure.LoginServices;
using Infrastructure.EmailService;

namespace API.Extension
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
         IConfiguration config)
        {
            services.AddControllers()
                .AddFluentValidation(x=>x.RegisterValidatorsFromAssemblyContaining<Application.Tournaments.Create>());
            services.AddSignalR();
            services.AddCors(options=>
            {
                options.AddPolicy("AllowLocalClient", builder=>
                {
                    builder.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .WithExposedHeaders("WWW-Authenticate")
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });
            
            services.Configure<CookiePolicyOptions>(options =>
            {
            
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddHttpContextAccessor();
            services.AddDbContext<DataContext>(opt=>
            {
                
                opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
                
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            services.AddTransient<IUserAccessor, UserAccessor>();
            services.AddMediatR(typeof(Application.Tournaments.List).Assembly);
            services.AddAutoMapper(typeof(MappingProfile));           
            services.AddSingleton<IEmailSender, SendGridService>();
            services.AddSingleton<ISorter, Sorter>();
            services.AddSingleton<IImageUploader, CloudinaryImageUploader>();
            services.AddScoped<IGoogleLoginService, GoogleLoginService>();
            return services;
        }
    }
}