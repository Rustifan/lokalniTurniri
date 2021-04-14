using System;
using System.Threading.Tasks;
using Application.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, IWebHostEnvironment env)
        {
            _next = next;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch(Exception exception)
            {
               await HandleException(exception, context);
            }
        }

        public async Task HandleException(Exception exception, HttpContext context)
        {
            const int status = StatusCodes.Status500InternalServerError;

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = status;

            var error = exception.Message;
            var errorDetails = exception.StackTrace;
            
            var appException = _env.IsDevelopment() ?
                new AppException(error, status, errorDetails) :
                new AppException(error, status);

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy=JsonNamingPolicy.CamelCase
            };

            var response = JsonSerializer.Serialize(appException, jsonOptions);

            await context.Response.WriteAsync(response);

        }
    }
}