using Microsoft.Owin;
using Owin;
using System.Web.Http;
[assembly: OwinStartupAttribute(typeof(Angular2App.Startup))]
namespace Angular2App
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            //Install-Package Microsoft.AspNet.WebApi.OwinSelfHost
            HttpConfiguration config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
            name: "BookRoute",
            routeTemplate: "api/{controller}/{action}"
            );

            config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
            );

            app.UseWebApi(config);

        }
    }
}
