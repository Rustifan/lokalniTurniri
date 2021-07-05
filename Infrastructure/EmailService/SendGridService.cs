using System.Threading.Tasks;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.EmailService
{
    public class SendGridService: IEmailSender
    {
        private readonly IConfiguration _configuration;
        public SendGridService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            var apiKey = _configuration["SendGrid:Key"];
            var apiUser = _configuration["SendGrid:Name"];
            var from = _configuration["SendGrid:From"];
            var client = new SendGridClient(apiKey);
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(from, apiUser),
                Subject = subject,
                PlainTextContent = message,
                HtmlContent = message
            };
            msg.AddTo(new EmailAddress(email));

            msg.SetClickTracking(false, false);

            await client.SendEmailAsync(msg);


        }
    }
}
