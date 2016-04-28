using System.Web.Http;
using System.Linq;
using WEB.Models;
using Microsoft.AspNet.Identity.EntityFramework;

namespace WEB.Controllers
{
    [Authorize, RoutePrefix("api/roles")]
    public class RolesController : BaseApiController
    {
        [HttpGet, Route("")]
		public IHttpActionResult Search([FromUri]PagingOptions pagingOptions)
        {
            IQueryable<IdentityRole> results = DbContext.Roles;
            results = results.OrderBy(r => r.Name);

            return Ok(GetPaginatedResponse(results, pagingOptions).Select(p => ModelFactory.Create(p)));
        }
    }
}