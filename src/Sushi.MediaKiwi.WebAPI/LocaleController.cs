using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to manage Locales.
    /// </summary>
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
        /// Gets all enabled locales.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [Route("enabled")]
        [AllowAnonymous]
        public async Task<ActionResult<ListResult<Locale>>> GetEnabledLocales()
        {   
            var result = await _localeService.GetAllAsync(true, new DAL.Paging.PagingValues(0, 1000));
            return this.CreateResponse(result);
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

        /// <summary>
        /// Gets a locale.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<Locale>> GetLocale(string id)
        {
            var result = await _localeService.GetAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Creates a new locale.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]
        public async Task<ActionResult<Locale>> CreateLocale(string id, Locale request)
        {
            var result = await _localeService.CreateAsync(id, request);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Deletes a locale.
        /// </summary>        
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteLocale(string id)
        {
            var result = await _localeService.DeleteAsync(id);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Updates an existing locale.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        public async Task<ActionResult<Locale>> UpdateLocale(string id, Locale request)
        {
            var result = await _localeService.UpdateAsync(id, request);
            return this.CreateResponse(result);
        }
    }
}