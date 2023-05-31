using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/locales")]
    public class LocaleController : MediaKiwiControllerBase
    {
        private readonly LocaleService _localeService;
        private readonly PagingRetriever _pagingRetriever;

        /// <summary>
        /// Creates a new instance of <see cref="LocaleController"/>.
        /// </summary>
        /// <param name="localeService"></param>
        /// <param name="pagingRetriever"></param>
        public LocaleController(LocaleService localeService, PagingRetriever pagingRetriever)
        {
            _localeService = localeService;
            _pagingRetriever = pagingRetriever;
        }

        /// <summary>
        /// Gets all locales.
        /// </summary>
        /// <param name="onlyEnabled">If set to true, only locales with enabled set to true are returned.</param>
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<Locale>>> GetLocales(bool? onlyEnabled)
        {
            var pagingValues = _pagingRetriever.GetPaging();
            var result = await _localeService.GetAllAsync(onlyEnabled.GetValueOrDefault(), pagingValues);
            return this.CreateResponse(result);
        }
    }
}