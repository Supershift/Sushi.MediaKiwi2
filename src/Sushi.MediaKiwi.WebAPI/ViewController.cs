using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/views")]
    public class ViewController : MediaKiwiControllerBase
    {
        private readonly ViewService _viewService;
        private readonly PagingRetriever _pagingRetriever;

        public ViewController(ViewService viewService, PagingRetriever pagingRetriever)
        {
            _viewService = viewService;
            _pagingRetriever = pagingRetriever;
        }

        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<View>>> GetViews([FromQuery] int? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _viewService.GetAllAsync(sectionID, pagingValues);
            return this.CreateResponse(result);
        }
    }
}