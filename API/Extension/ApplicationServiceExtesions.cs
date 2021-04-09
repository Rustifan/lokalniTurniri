using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;
using MediatR;
using FluentValidation.AspNetCore;
using AutoMapper;
using Application.Core;

namespace API.Extension
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
         IConfiguration config)
        {
            services.AddControllers()
                .AddFluentValidation(x=>x.RegisterValidatorsFromAssemblyContaining<Application.Tournaments.Create>());

            services.AddDbContext<DataContext>(opt=>
            {
                
                opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });

            services.AddMediatR(typeof(Application.Tournaments.List).Assembly);
            services.AddAutoMapper(typeof(MappingProfile));           

            return services;
        }
    }
}