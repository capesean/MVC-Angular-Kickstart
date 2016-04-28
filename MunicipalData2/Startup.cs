using WEB.Models;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WEB.Startup))]
namespace WEB
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            var config = new Migrations.Configuration();
            config.Seed();
        }
    }
}
