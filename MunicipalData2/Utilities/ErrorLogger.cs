using System;
using WEB.Models;
using System.Data.Entity;
using System.Net.Mail;

namespace WEB.Utilities
{
    public static class ErrorLogger
    {
        public static void Log(Exception err, string url, string userName)
        {
            var error = new Error
            {
                Date = DateTime.Now,
                Message = err.Message,
                Url = url,
                UserName = userName
            };

            using (var dbContext = new ApplicationDbContext())
            {
                try
                {
                    dbContext.Entry(error).State = EntityState.Added;
                    dbContext.SaveChanges();
                }
                catch { }

                var settings = new Settings(dbContext);
                if (!string.IsNullOrWhiteSpace(settings.EmailToErrors))
                {
                    try
                    {
                        var body = string.Empty;
                        body += "URL: " + error.Url + Environment.NewLine;
                        body += "DATE: " + error.Date.ToString("dd MMMM yyyy, HH:mm:ss") + Environment.NewLine;
                        body += "USER: " + error.UserName + Environment.NewLine;
                        body += Environment.NewLine;
                        body += error.Message + Environment.NewLine;

                        using (var mail = new MailMessage())
                        {
                            mail.To.Add(new MailAddress(settings.EmailToErrors));
                            mail.Subject = "Website Error";
                            mail.Body = body;
                            Email.SendMail(mail, settings);
                        }
                    }
                    catch  { }
                }
            }


        }
    }
}
