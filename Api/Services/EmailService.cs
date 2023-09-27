using Api.DTOs.Account;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System;

namespace Api.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<bool> SendEmailAsync(EmailSendDto emailSend)
        {
            MailjetClient client = new MailjetClient(_config["MailJet:ApiKey"], _config["MailJet:SecretKey"]);

            var email = new TransactionalEmailBuilder()
                .WithFrom(new SendContact(_config["Email:From"], _config["Email:ApplicationName"]))
                .WithSubject(emailSend.Subject)
                .WithHtmlPart(emailSend.Body)
                .WithTo(new SendContact(emailSend.To))
                .Build();

            var response = await client.SendTransactionalEmailAsync(email);            
            //if(response.Messages != null) {
               // if (response.Messages[0].Status == "success")
               // {
                    return true;
               // }
          //  }
           // return false;
        }

        public async Task<bool> SendEmailSMTPAsync(EmailSendDto emailSend)
        {
            var fromAddress =new MailAddress(_config["Email:From"], _config["Email:ApplicationName"]);
            var toAddress = new MailAddress(emailSend.To);

            var subject = emailSend.Subject;
            var body = emailSend.Body;

            var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true // Set this to true if you're sending HTML content
            };

            var smtpClient = new SmtpClient
            {
                Host = "smtp.gmail.com", // SMTP server address
                Port = 465,//587, // Port number
                EnableSsl = true, // Set to true if using SSL/TLS
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("gregpiev@gmail.com", "piev180457")
            };

            try
            {
                smtpClient.Send(message);
                Console.WriteLine("Email sent successfully!");
                return await GetAwaiter(true);
            }
            catch(Exception ex)
            {
                Console.WriteLine("Email sending failed: " + ex.ToString());
                return await GetAwaiter(true); 
            }            
        }

        private Task<bool> GetAwaiter(bool v)
        {
            throw new NotImplementedException();
        }
    }
}
