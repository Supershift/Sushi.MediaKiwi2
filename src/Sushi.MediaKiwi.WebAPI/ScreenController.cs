using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/screens")]
    public class ScreenController : MediaKiwiControllerBase
    {
        private readonly ScreenService _screenService;

        public ScreenController(ScreenService screenService)
        {
            _screenService = screenService;
        }

        [HttpGet]
        public async Task<ActionResult<ListResult<Screen>>> GetScreens([FromQuery] int? sectionID)
        {
            var result = await _screenService.GetAllAsync(sectionID);
            return this.CreateResponse(result);
        }
    }
}