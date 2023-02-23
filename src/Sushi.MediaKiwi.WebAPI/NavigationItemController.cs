using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/navigationitems")]
    public class NavigationItemController : MediaKiwiControllerBase
    {
        private readonly NavigationItemService _navigationItemService;
        private readonly PagingRetriever _pagingRetriever;

        public NavigationItemController(NavigationItemService screenService, PagingRetriever pagingRetriever)
        {
            _navigationItemService = screenService;
            _pagingRetriever = pagingRetriever;
        }

        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems([FromQuery] int? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _navigationItemService.GetAllAsync(sectionID, pagingValues);
            return this.CreateResponse(result);
        }
    }
}