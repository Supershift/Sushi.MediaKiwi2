using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/navigationitems")]
    public class NavigationItemController : MediaKiwiControllerBase
    {
        private readonly NavigationItemService _screenService;
        private readonly PagingRetriever _pagingRetriever;

        public NavigationItemController(NavigationItemService screenService, PagingRetriever pagingRetriever)
        {
            _screenService = screenService;
            _pagingRetriever = pagingRetriever;
        }

        [HttpGet]
        [Paging]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems([FromQuery] int? sectionID)
        {
            var paging = _pagingRetriever.GetPaging();
            var result = await _screenService.GetAllAsync(sectionID);
            return this.CreateResponse(result);
        }
    }
}