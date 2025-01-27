using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to retrieve Sections.
    /// </summary>
    [Route($"{BaseRoute}/sections")]    
    public class SectionController : MediaKiwiControllerBase
    {
        private readonly SectionService _sectionService;

        /// <summary>
        /// Creates a new instance of the SectionController.
        /// </summary>
        /// <param name="sectionService"></param>
        public SectionController(SectionService sectionService)
        {
            _sectionService = sectionService;
        }
        
        /// <summary>
        /// Gets all sections.
        /// </summary>
        /// <returns></returns>
        [HttpGet]      
        public async Task<ActionResult<ListResult<Section>>> GetSections([FromQuery] PagingValues page)
        {
            var result = await _sectionService.GetAllAsync(page);
            return this.ToResponse(result);
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
            return this.ToResponse(result);
        }
    }
}