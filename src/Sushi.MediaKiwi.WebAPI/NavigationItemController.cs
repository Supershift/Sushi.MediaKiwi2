using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to retrieve NavigationItems.
    /// </summary>
    [Route($"{BaseRoute}/navigationitems")]
    [Authorize]
    public class NavigationItemController : MediaKiwiControllerBase
    {
        private readonly NavigationItemService _navigationItemService;

        /// <summary>
        /// Creates a new instance of the NavigationItemController.
        /// </summary>
        /// <param name="screenService"></param>
        public NavigationItemController(NavigationItemService screenService)
        {
            _navigationItemService = screenService;
        }


        /// <summary>
        /// Gets all navigation items for the given filters.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems(string? sectionId, [FromQuery] PagingValues pagingValues, [FromQuery] SortingValues sorting)
        {
            var result = await _navigationItemService.GetAllAsync(sectionId, pagingValues, sorting);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Gets a NavigationItem.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<NavigationItem>> GetNavigationItem(string id)
        {
            var result = await _navigationItemService.GetAsync(id);
            return this.ToResponse(result);
        }
    }
}