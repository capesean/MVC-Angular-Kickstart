using System;
using System.Collections.Generic;
using System.Linq;
using WEB.Models;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using System.Web;
using Microsoft.AspNet.Identity.Owin;
using System.Web.Http.Results;

namespace WEB.Controllers
{
    public class BaseApiController : ApiController
    {
        private ApplicationUserManager _userManager;
        private ApplicationDbContext _dbContext;
        private ApplicationUser _currentUser;
        private Settings _settings;
        internal ModelFactory ModelFactory;
        internal ApplicationUserManager UserManager
        {
            get
            {
                if (_userManager == null) _userManager = HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
                return _userManager;
            }
        }
        internal ApplicationDbContext DbContext
        {
            get
            {
                if (_dbContext == null) _dbContext = HttpContext.Current.GetOwinContext().Get<ApplicationDbContext>();
                return _dbContext;
            }
        }
        internal Settings Settings
        {
            get
            {
                if (_settings == null) _settings = new Settings(DbContext);
                return _settings;
            }
        }
        internal ApplicationUser CurrentUser
        {
            get
            {
                if (_currentUser == null) _currentUser = UserManager.FindByNameAsync(User.Identity.Name).Result;
                return _currentUser;
            }
        }

        public BaseApiController()
            : base()
        {
            ModelFactory = new ModelFactory();
        }

        protected List<T> GetPaginatedResponse<T>(IQueryable<T> query, PagingOptions pagingOptions)
        {
            if (pagingOptions == null) pagingOptions = new PagingOptions();

            var totalCount = query.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / pagingOptions.PageSize);

            var prevLink = pagingOptions.PageIndex > 0 ? Url.Link("DefaultApi", new { pagingOptions.PageSize, page = pagingOptions.PageIndex - 1 }) : "";
            var nextLink = pagingOptions.PageIndex < totalPages - 1 ? Url.Link("DefaultApi", new { pagingOptions.PageSize, page = pagingOptions.PageIndex + 1 }) : "";
            var firstLink = Url.Link("DefaultApi", new { pagingOptions.PageSize, page = 0 });
            var lastLink = Url.Link("DefaultApi", new { pagingOptions.PageSize, page = totalPages - 1 });

            var paginationHeader = new
            {
                PageNumber = pagingOptions.PageIndex,
                pagingOptions.PageSize,
                TotalCount = totalCount,
                TotalPages = totalPages,
                FirstPageLink = firstLink,
                PrevPageLink = prevLink,
                NextPageLink = nextLink,
                LastPageLink = lastLink
            };

            HttpContext.Current.Response.Headers.Add("X-Pagination", Newtonsoft.Json.JsonConvert.SerializeObject(paginationHeader));

            if (pagingOptions.PageSize <= 0) return query.ToList();

            return query
                .Skip(pagingOptions.PageSize * pagingOptions.PageIndex)
                .Take(pagingOptions.PageSize)
                .ToList();
        }

        protected IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return BadRequest();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        //protected BadRequestObjectResult BadRequest(ModelStateDictionary ModelState, string key, string error)
        //{
        //    ModelState.AddModelError(key, error);
        //    return BadRequest(ModelState);
        //}
    }

    public class PagingOptions
    {
        public PagingOptions()
        {
            PageIndex = 0;
            PageSize = 100;
            OrderBy = null;
            OrderByAscending = true;
        }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public string OrderBy { get; set; }
        public bool OrderByAscending { get; set; }
    }
}