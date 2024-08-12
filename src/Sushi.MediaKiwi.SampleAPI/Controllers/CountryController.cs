using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi.WebAPI.Sorting;

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
        public async Task<ActionResult<ListResult<Country>>> GetAll(
            [FromQuery] PagingValues? paging,
            [FromQuery] SortingStrings? sortingStrings)
        {
            var sorting = sortingStrings?.GetSorting<SortMap, Country>();
            var result = await _countryService.GetAllAsync(paging, sorting);
            return this.CreateResponse(result);
        }

        private class SortMap : SortMap<Country>
        {
            public SortMap()
            {
                Add(x => x.Name);
                Add(x => x.Code);
            }
        }
    }
}
