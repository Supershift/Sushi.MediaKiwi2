using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
using Sushi.MediaKiwi.WebAPI.Sorting;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to manage Views.
    /// </summary>
    [Route($"{BaseRoute}/views")]
    public class ViewController : MediaKiwiControllerBase
    {
        internal class ViewSortMap : SortMap<View>
        {
            public ViewSortMap()
            {
                Add(x => x.Name);                
            }
        }

        private readonly ViewService _viewService;
        private readonly PagingRetriever _pagingRetriever;
        private readonly SortingRetriever _sortingRetriever;

        /// <summary>
        /// Creates a new instance of the ViewController.
        /// </summary>
        /// <param name="viewService"></param>
        /// <param name="pagingRetriever"></param>
        /// <param name="sortingRetriever"></param>
        public ViewController(ViewService viewService, PagingRetriever pagingRetriever, SortingRetriever sortingRetriever)
        {
            _viewService = viewService;
            _pagingRetriever = pagingRetriever;
            _sortingRetriever = sortingRetriever;
        }

        /// <summary>
        /// Deletes a view.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<View>> DeleteView(string id)
        {
            var result = await _viewService.DeleteAsync(id);
            return this.CreateResponse(result);
        }

        

        /// <summary>
        /// Gets all views.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        [QueryStringSorting<ViewSortMap>()]
        public async Task<ActionResult<ListResult<View>>> GetViews(GetViewsQuery query)
        {
            var sortValues = _sortingRetriever.GetSorting<View>();
            var result = await _viewService.GetAllAsync(query.Page!, sortValues);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets a view.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<View>> GetView(string id)
        {
            var result = await _viewService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new view.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<View>> CreateView(string id, View request)
        {
            var result = await _viewService.CreateAsync(id, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing view.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<View>> UpdateView(string id, View request)
        {
            var result = await _viewService.UpdateAsync(id, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Query for GetViews
        /// </summary>
        public class GetViewsQuery
        {
            /// <summary>
            /// Paging values.
            /// </summary>
            public PagingValues? Page { get; set; }
        }
    }
}