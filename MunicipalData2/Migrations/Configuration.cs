namespace WEB.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Data.Entity.Validation;
    using System.Linq;
    using WEB.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<WEB.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        public void Seed()
        {
            Seed(new ApplicationDbContext());
        }

        protected async override void Seed(ApplicationDbContext db)
        {
            using (var context = new ApplicationDbContext())
            using (var roleStore = new RoleStore<IdentityRole>(context))
            using (var roleManager = new RoleManager<IdentityRole>(roleStore))
            using (var userStore = new UserStore<ApplicationUser>(context))
            using (var userManager = new UserManager<ApplicationUser>(userStore))
            {
                // add users
                var email = "test@test.com";
                ApplicationUser user;
                if (await userManager.FindByEmailAsync(email) == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = email,
                        Email = email,
                        EmailConfirmed = true,
                        FirstName = "Your",
                        LastName = "Name",
                        Enabled = true
                    };
                    await userManager.CreateAsync(user, "L3tMe!n");
                }

                user = await userManager.FindByEmailAsync(email);
                foreach (var role in Enum.GetNames(typeof(Roles)))
                {

                    if (!await roleManager.RoleExistsAsync(role.ToLower()))
                    {
                        await roleManager.CreateAsync(new ApplicationRole() { Name = role });
                    }

                    if (!await userManager.IsInRoleAsync(user.Id, role))
                    {
                        await userManager.AddToRoleAsync(user.Id, role);
                    }
                }

                if (context.Settings.SingleOrDefault() == null)
                {
                    var settings = new Settings();

                    context.Entry(settings).State = EntityState.Added;
                    try
                    {
                        context.SaveChanges();
                    }
                    catch (DbEntityValidationException e)
                    {
                        foreach (var eve in e.EntityValidationErrors)
                        {
                            e.Data.Add("error", string.Format("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                                eve.Entry.Entity.GetType().Name, eve.Entry.State));

                            Console.WriteLine();
                            foreach (var ve in eve.ValidationErrors)
                            {
                                e.Data.Add(ve.PropertyName, ve.ErrorMessage);
                            }
                        }
                        throw;
                    }
                }
            }
        }
    }
}
