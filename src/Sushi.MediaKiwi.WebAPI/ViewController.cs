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

        /// <summary>
        /// Gets all views.
        /// </summary>
        /// <param name="sectionID"></param>
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<View>>> GetViews([FromQuery] int? sectionID)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _viewService.GetAllAsync(sectionID, pagingValues);
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