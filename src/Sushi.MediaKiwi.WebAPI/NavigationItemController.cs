using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/navigationitems")]
    [Authorize]
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
        [Authorize]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems([FromQuery] string? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _navigationItemService.GetAllAsync(sectionID, pagingValues);
            return this.CreateResponse(result);
        }
        
        /// <summary>
        /// Gets a NavigationItem.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        [Authorize]
        public async Task<ActionResult<NavigationItem>> GetNavigationItem(string id)
        {
            var result = await _navigationItemService.GetAsync(id);
            return this.CreateResponse(result);
        }
    }
}