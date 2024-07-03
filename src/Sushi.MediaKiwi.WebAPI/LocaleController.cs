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

        /// <summary>
        /// Creates a new instance of <see cref="LocaleController"/>.
        /// </summary>
        /// <param name="localeService"></param>
        public LocaleController(LocaleService localeService)
        {
            _localeService = localeService;;
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
            var result = await _localeService.GetAllAsync(true, new PagingValues(0, 1000));
            return this.ToResponse(result);
        }

        /// <summary>
        /// Gets all locales.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [QueryStringPaging]
        public async Task<ActionResult<ListResult<Locale>>> GetLocales(GetLocalesQuery query)
        {
            var result = await _localeService.GetAllAsync(query.onlyEnabled.GetValueOrDefault(), query.Page);
            return this.ToResponse(result);
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
            return this.ToResponse(result);
        }

        /// <summary>
        /// Creates a new locale.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<Locale>> CreateLocale(string id, Locale request)
        {
            var result = await _localeService.CreateAsync(id, request);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Deletes a locale.
        /// </summary>        
        /// <returns></returns>
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult> DeleteLocale(string id)
        {
            var result = await _localeService.DeleteAsync(id);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Updates an existing locale.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = Constants.AdminPolicyName)]
        public async Task<ActionResult<Locale>> UpdateLocale(string id, Locale request)
        {
            var result = await _localeService.UpdateAsync(id, request);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Query for GetLocales
        /// </summary>
        public class GetLocalesQuery
        {
            /// <summary>
            /// Paging values.
            /// </summary>
            public PagingValues Page { get; set; } = null!;

            /// <summary>
            /// If set to true, only locales with enabled set to true are returned.
            /// </summary>
            public bool? onlyEnabled { get; set; }
        }
    }
}