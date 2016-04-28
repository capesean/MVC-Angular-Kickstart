using Microsoft.AspNet.Identity.EntityFramework;

namespace WEB.Models 
{
	public class RoleDTO
	{
		public string Id { get; set; }
		public string Name { get; set; }
	}

	public partial class ModelFactory
	{
		public RoleDTO Create(IdentityRole role)
		{
			var dto = new RoleDTO
			{
				Id = role.Id,
				Name = role.Name
			};

			return dto;
		}

	}
}