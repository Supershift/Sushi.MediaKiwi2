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
        private readonly SortingRetriever _sortingRetriever;

        public CountryController(CountryService countryService, SortingRetriever sortingRetriever)
        {
            _countryService = countryService;
            _sortingRetriever = sortingRetriever;
        }
        
        [HttpGet, QueryStringSorting<CountrySortMap>]      
        public async Task<ActionResult<ListResult<Country>>> GetAll(string? countryCode, string? countryName, [FromQuery] PagingValues paging)
        {
            var sorting = _sortingRetriever.GetSorting<Country>();
            var result = await _countryService.GetAllAsync(countryCode, countryName, paging, sorting);
            return this.ToResponse(result);
        }
        

        [HttpGet, Route("{code}")]      
        public async Task<ActionResult<Country>> GetCountry(string code)
        {   
            var result = await _countryService.GetCountryAsync(code);
            return this.ToResponse(result);
        }

        private sealed class CountrySortMap : SortMap<Country>
        {
            public CountrySortMap()
            {
                Add(x => x.Code);
                Add(x => x.Name);
            }
        }
    }
}
