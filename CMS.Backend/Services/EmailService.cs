using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace CMS.Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(
                emailSettings["SenderName"],
                emailSettings["SenderEmail"]
            ));

            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart("html")
            {
                Text = body
            };

            using var smtp = new SmtpClient();

            await smtp.ConnectAsync(
                emailSettings["SmtpServer"],
                int.Parse(emailSettings["SmtpPort"]),
                SecureSocketOptions.StartTls
            );

            await smtp.AuthenticateAsync(
                emailSettings["SenderEmail"],
                emailSettings["Password"]
            );

            await smtp.SendAsync(message);
            await smtp.DisconnectAsync(true);
        }
    }
}