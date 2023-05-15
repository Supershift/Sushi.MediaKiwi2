using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.DAL.Sorting;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
using Sushi.MediaKiwi.WebAPI.Sorting;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/views")]
    public class ViewController : MediaKiwiControllerBase
    {
        public class ViewSortMap : SortMap<View>
        {
            public ViewSortMap()
            {
                Add(x => x.Name);                
            }
        }

        private readonly ViewService _viewService;
        private readonly PagingRetriever _pagingRetriever;
        private readonly SortingRetriever _sortingRetriever;

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
        public async Task<ActionResult<View>> DeleteView(int id)
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
        public async Task<ActionResult<ListResult<View>>> GetViews([FromQuery] int? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var sortValues = _sortingRetriever.GetSorting<View>();
            var result = await _viewService.GetAllAsync(sectionID, pagingValues, sortValues);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets a view.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<View>> GetView(int id)
        {
            var result = await _viewService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new view.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<View>> CreateView(View request)
        {
            var result = await _viewService.SaveAsync(null, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing view.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<View>> UpdateView(int id, View request)
        {
            var result = await _viewService.SaveAsync(id, request);
            return this.CreateResponse(result);
        }
    }
}