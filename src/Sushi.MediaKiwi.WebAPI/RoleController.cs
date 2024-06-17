using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to retrieve roles.
    /// </summary>
    [Route($"{BaseRoute}/roles")]
    public class RoleController : MediaKiwiControllerBase
    {
        private readonly RoleService _roleService;

        /// <summary>
        /// Creates a new instance of the RoleController.
        /// </summary>
        /// <param name="roleService"></param>
        public RoleController(RoleService roleService)
        {
            _roleService = roleService;
        }

        /// <summary>
        /// Gets all roles.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ListResult<Role>>> GetRoles()
        {
            var result = await _roleService.GetAllAsync();
            return this.CreateResponse(result);
        }
    }
}