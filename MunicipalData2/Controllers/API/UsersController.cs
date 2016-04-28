using System;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq;
using System.Net.Mail;
using WEB.Models;
using System.Data.Entity;
using System.Net;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity;

namespace WEB.Controllers
{
    [Authorize, RoutePrefix("api/users")]
    public class UsersController : BaseApiController
    {
        [HttpGet, Route("profile")] // todo: change api to use this route
        public IHttpActionResult Profile()
        {
            return Ok(new
            {
                Email = CurrentUser.Email,
                FirstName = CurrentUser.FirstName,
                LastName = CurrentUser.LastName,
                FullName = CurrentUser.FullName,
                UserId = CurrentUser.Id,
                Roles = CurrentUser.Roles
            });
        }

        [HttpGet, Route("")]
		public IHttpActionResult Search([FromUri]PagingOptions pagingOptions, [FromUri]string searchText = null, [FromUri]string roleId = null)
        {
            IQueryable<ApplicationUser> results = UserManager.Users;

            if (roleId != null) results = results.Where(u => u.Roles.Any(c => c.RoleId == roleId));

            if (!string.IsNullOrWhiteSpace(searchText))
            {
                results = results.Where(u =>
                    u.FirstName.Contains(searchText)
                    || u.LastName.Contains(searchText)
                    || (u.FirstName + " " + u.LastName).Contains(searchText));
            }

            results = results.OrderBy(u => u.FirstName + " " + u.LastName);

            return Ok(GetPaginatedResponse(results, pagingOptions).Select(o => ModelFactory.Create(o)));
        }

        [HttpGet, Route("{id}")]
        public async Task<IHttpActionResult> Get(string id)
        {
            var user = await DbContext.Users.Include(u => u.Roles).SingleOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();

            return Ok(ModelFactory.Create(user));
        }

        [HttpPost, Route(""), Authorize(Roles = "Administrator")]
        public async Task<IHttpActionResult> Insert([FromBody]ApplicationUserDTO userDTO)
        {
            if (userDTO.Id != Guid.Empty.ToString()) return BadRequest("Invalid User Id");

            return await SaveAsync(userDTO);
        }

        [HttpPost, Route("{id}"), Authorize(Roles = "Administrator")]
        public async Task<IHttpActionResult> Update(string id, [FromBody]ApplicationUserDTO userDTO)
        {
            if (id != userDTO.Id) return BadRequest("Id mismatch");

            return await SaveAsync(userDTO);
        }

        private async Task<IHttpActionResult> SaveAsync(ApplicationUserDTO userDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await UserManager.FindByEmailAsync(userDTO.Email);

            if (user != null && user.Id != userDTO.Id)
                return BadRequest("Email address already exists.");

            var isNew = userDTO.Id == Guid.Empty.ToString();

            var password = string.Empty;
            if (isNew)
            {
                user = new ApplicationUser();
                password = "Temp0rar! P@ssw_rd"; //todo: randomly generate?
            }
            else
            {
                user = await UserManager.FindByIdAsync(userDTO.Id);
                if (user == null) return NotFound();
            }

            ModelFactory.Hydrate(user, userDTO);

            // might have to do this with the overload with no password if creating users?
            var saveResult = (isNew ? await UserManager.CreateAsync(user, password) : await UserManager.UpdateAsync(user));

            if (!saveResult.Succeeded)
                return GetErrorResult(saveResult);

            if (!isNew)
                foreach (var role in Enum.GetNames(typeof(Roles)))
                    await UserManager.RemoveFromRoleAsync(user.Id, role);

            if (userDTO.RoleIds != null)
            {
                using (var roleStore = new RoleStore<IdentityRole>(DbContext))
                using (var roleManager = new RoleManager<IdentityRole>(roleStore))
                {
                    foreach (var role in userDTO.RoleIds)
                    {
                        var r = await roleManager.FindByIdAsync(role);
                        var result = await UserManager.AddToRoleAsync(user.Id, r.Name);
                    }
                }
            }

            return Ok(ModelFactory.Create(user)); //todo: return Created(url, T) ?
        }


    }
}
