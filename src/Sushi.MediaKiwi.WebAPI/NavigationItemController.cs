using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Sorting;

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
        private readonly SortingRetriever _sortingRetriever;
        
        internal class NavigationItemsSortMap : SortMap<NavigationItem>
        {
            public NavigationItemsSortMap()
            {
                Add(x => x.Name);
                Add(x => x.SortOrder);
            }
        }

        /// <summary>
        /// Creates a new instance of the NavigationItemController.
        /// </summary>
        /// <param name="screenService"></param>
        /// <param name="sortingRetriever"></param>
        public NavigationItemController(NavigationItemService screenService, SortingRetriever sortingRetriever)
        {
            _navigationItemService = screenService;
            _sortingRetriever = sortingRetriever;
        }


        /// <summary>
        /// Gets all navigation items for the given filters.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [QueryStringSorting<NavigationItemsSortMap>()]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems(string? sectionId, [FromQuery] PagingValues pagingValues)
        {
            var sortValues = _sortingRetriever.GetSorting<NavigationItem>();
            var result = await _navigationItemService.GetAllAsync(sectionId, pagingValues, sortValues);
            return this.CreateResponse(result);
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
            return this.CreateResponse(result);
        }
    }
}