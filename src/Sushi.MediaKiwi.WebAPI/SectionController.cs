using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;
using System.ComponentModel.DataAnnotations;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to retrieve Sections.
    /// </summary>
    [Route($"{BaseRoute}/sections")]    
    public class SectionController : MediaKiwiControllerBase
    {
        private readonly SectionService _sectionService;
        private readonly PagingRetriever _pagingRetriever;

        /// <summary>
        /// Creates a new instance of the SectionController.
        /// </summary>
        /// <param name="sectionService"></param>
        /// <param name="pagingRetriever"></param>
        public SectionController(SectionService sectionService, PagingRetriever pagingRetriever)
        {
            _sectionService = sectionService;
            _pagingRetriever = pagingRetriever;
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
        public async Task<ActionResult<Section>> GetSection(string id)
        {
            var result = await _sectionService.GetAsync(id);
            return this.CreateResponse(result);
        }
    }
}