using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/sections")]
    public class SectionController : MediaKiwiControllerBase
    {
        private readonly SectionService _sectionService;
        private readonly PagingRetriever _pagingRetriever;

        public SectionController(SectionService sectionService, PagingRetriever pagingRetriever)
        {
            _sectionService = sectionService;
            _pagingRetriever = pagingRetriever;
        }

        /// <summary>
        /// Deletes a Section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult<Section>> DeleteSection(int id)
        {
            var result = await _sectionService.DeleteAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets all sections.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<Section>>> GetSections()
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _sectionService.GetAllAsync(pagingValues);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets a Section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Section>> GetSection(int id)
        {
            var result = await _sectionService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new Section.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult<Section>> CreateSection(Section request)
        {
            var result = await _sectionService.SaveAsync(null, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing Section.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<Section>> UpdateSection(int id, Section request)
        {
            var result = await _sectionService.SaveAsync(id, request);
            return this.CreateResponse(result);
        }
    }
}