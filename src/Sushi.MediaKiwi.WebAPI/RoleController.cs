using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/roles")]
    public class RoleController : MediaKiwiControllerBase
    {
        private readonly RoleService _roleService;

        public RoleController(RoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<Role>>> GetRoles()
        {
            var result = await _roleService.GetAllAsync();
            return this.CreateResponse(result);
        }
    }
}