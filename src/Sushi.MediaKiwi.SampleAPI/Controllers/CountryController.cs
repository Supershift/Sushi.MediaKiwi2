using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.SampleAPI.Service;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.SampleAPI.Controllers
{   
    [Route($"{BaseRoute}/countries")]
    public class CountryController : SampleControllerBase
    {
        private readonly CountryService _countryService;
        private readonly PagingRetriever _pagingRetriever;

        public CountryController(CountryService countryService, PagingRetriever pagingRetriever)
        {
            _countryService = countryService;
            _pagingRetriever = pagingRetriever;
        }

        [HttpGet]
        [QueryStringPaging]        
        public async Task<ActionResult<ListResult<Country>>> GetAll()
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _countryService.GetAllAsync(pagingValues);
            return this.CreateResponse(result);
        }
    }
}
