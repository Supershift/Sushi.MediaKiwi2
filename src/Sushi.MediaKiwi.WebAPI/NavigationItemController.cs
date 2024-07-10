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
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        [QueryStringSorting<NavigationItemsSortMap>()]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems(GetNavigationItemsQuery query)
        {
            var sortValues = _sortingRetriever.GetSorting<NavigationItem>();
            var result = await _navigationItemService.GetAllAsync(query.sectionID, query.Page, sortValues);
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

        /// <summary>
        /// Query for GetNavigationItems
        /// </summary>
        public class GetNavigationItemsQuery
        {
            /// <summary>
            /// Paging values.
            /// </summary>
            public PagingValues Page { get; set; } = null!;

            /// <summary>
            /// If set to true, only locales with enabled set to true are returned.
            /// </summary>
            public string? sectionID { get; set; }
        }
    }
}