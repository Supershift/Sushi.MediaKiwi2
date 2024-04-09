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

        /// <summary>
        /// Deletes a NavigationItem.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> DeleteNavigationItem(int id)
        {
            var result = await _navigationItemService.DeleteAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets a NavigationItem.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> GetNavigationItem(int id)
        {
            var result = await _navigationItemService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new NavigationItem.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> CreateNavigationItem(int id, NavigationItem request)
        {
            var result = await _navigationItemService.CreateAsync(id, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing NavigationItem.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> UpdateNavigationItem(int id, NavigationItem request)
        {
            var result = await _navigationItemService.UpdateAsync(id, request);
            return this.CreateResponse(result);
        }
    }
}