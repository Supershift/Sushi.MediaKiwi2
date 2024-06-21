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
        public async Task<ActionResult<ListResult<Country>>> GetAll(GetCountryQuery query)
        {
            var result = await _countryService.GetAllAsync(query);
            return this.CreateResponse(result);
        }
    }

    public class GetCountryQuery
    {
        public PagingValues? Page { get; set; }
    }
}
