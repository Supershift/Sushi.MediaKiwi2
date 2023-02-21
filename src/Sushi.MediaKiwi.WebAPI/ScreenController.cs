using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/screens")]
    public class ScreenController : MediaKiwiControllerBase
    {
        private readonly ScreenService _screenService;
        private readonly PagingRetriever _pagingRetriever;

        public ScreenController(ScreenService screenService, PagingRetriever pagingRetriever)
        {
            _screenService = screenService;
            _pagingRetriever = pagingRetriever;
        }

        [HttpGet]
        [Paging]
        public async Task<ActionResult<ListResult<Screen>>> GetScreens([FromQuery] int? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _screenService.GetAllAsync(sectionID, pagingValues);
            return this.CreateResponse(result);
        }
    }
}