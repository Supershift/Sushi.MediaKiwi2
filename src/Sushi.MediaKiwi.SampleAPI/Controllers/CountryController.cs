using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{
    [Route($"{BaseRoute}/countries")]
    [Authorize(Constants.CustomPolicyName)]
    public class CountryController : SampleControllerBase
    {
        private readonly CountryService _countryService;

        public CountryController(CountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]      
        public async Task<ActionResult<ListResult<Country>>> GetAll(string? countryCode, string? countryName, [FromQuery] PagingValues paging)
        {   
            var result = await _countryService.GetAllAsync(countryCode, countryName, paging);
            return this.ToResponse(result);
        }
        

        [HttpGet, Route("{code}")]      
        public async Task<ActionResult<Country>> GetCountry(string code)
        {   
            var result = await _countryService.GetCountryAsync(code);
            return this.ToResponse(result);
        }
    }
}
