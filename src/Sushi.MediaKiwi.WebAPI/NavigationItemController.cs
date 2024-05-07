using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
using Sushi.MediaKiwi.WebAPI.Sorting;
using static Sushi.MediaKiwi.WebAPI.ViewController;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/navigationitems")]
    public class NavigationItemController : MediaKiwiControllerBase
    {
        private readonly NavigationItemService _navigationItemService;
        private readonly PagingRetriever _pagingRetriever;
        private readonly SortingRetriever _sortingRetriever;

        public class NavigationItemsSortMap : SortMap<NavigationItem>
        {
            public NavigationItemsSortMap()
            {
                Add(x => x.Name);
                Add(x => x.SortOrder);
            }
        }

        public NavigationItemController(NavigationItemService screenService, PagingRetriever pagingRetriever, SortingRetriever sortingRetriever)
        {
            _navigationItemService = screenService;
            _pagingRetriever = pagingRetriever;
            _sortingRetriever = sortingRetriever;
        }


        [HttpGet]
        [QueryStringPaging]
        [QueryStringSorting<NavigationItemsSortMap>()]
        public async Task<ActionResult<ListResult<NavigationItem>>> GetNavigationItems([FromQuery] int? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var sortValues = _sortingRetriever.GetSorting<NavigationItem>();
            var result = await _navigationItemService.GetAllAsync(sectionID, pagingValues, sortValues);
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
        public async Task<ActionResult<NavigationItem>> CreateNavigationItem(NavigationItem request)
        {
            var result = await _navigationItemService.CreateAsync(request);
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