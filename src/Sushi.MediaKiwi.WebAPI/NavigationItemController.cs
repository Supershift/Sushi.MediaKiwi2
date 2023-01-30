using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/navigationitems")]
    public class NavigationItemController : MediaKiwiControllerBase
    {
        private readonly NavigationItemService _screenService;

        public NavigationItemController(NavigationItemService screenService)
        {
            _screenService = screenService;
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems([FromQuery] int? sectionID)
        {
            var result = await _screenService.GetAllAsync(sectionID);
            return this.CreateResponse(result);
        }
    }
}