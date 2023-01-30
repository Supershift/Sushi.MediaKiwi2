using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{   
    [Route("mediakiwi/api/sections")]
    public class SectionController : ControllerBase
    {
        private readonly SectionService _sectionService;

        public SectionController(SectionService sectionService)
        {
            _sectionService = sectionService;
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<Section>>> GetSections()
        {
            var result = await _sectionService.GetAllAsync();
            return this.CreateResponse(result);
        }
    }
}