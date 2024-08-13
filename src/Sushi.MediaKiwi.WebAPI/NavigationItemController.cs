using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
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
        
        /// <summary>
        /// 
        /// </summary>
        public class NavigationItemsSortMap : SortMap<NavigationItem>
        {
            /// <summary>
            /// 
            /// </summary>
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
        public NavigationItemController(NavigationItemService screenService)
        {
            _navigationItemService = screenService;
        }


        /// <summary>
        /// Gets all navigation items for the given filters.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems([FromQuery] GetNavigationItemsQuery query)
        {
            var sortValues = query.Sort?.GetSorting();
            var result = await _navigationItemService.GetAllAsync(query.sectionID, query.Page, sortValues);
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

        /// <summary>
        /// Query for GetNavigationItems
        /// </summary>
        public class GetNavigationItemsQuery
        {
            /// <summary>
            /// Paging values.
            /// </summary>
            public PagingValues? Page { get; set; }

            /// <summary>
            /// 
            /// </summary>
            public SortQuery<NavigationItemsSortMap, NavigationItem>? Sort { get; set; }

            /// <summary>
            /// If set to true, only locales with enabled set to true are returned.
            /// </summary>
            public string? sectionID { get; set; }
        }
    }
}