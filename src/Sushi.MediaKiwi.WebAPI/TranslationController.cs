using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    [Route($"{BaseRoute}/translations")]
    public class TranslationController : MediaKiwiControllerBase
    {
        private readonly TranslationService _translationService;
        private readonly PagingRetriever _pagingRetriever;

        /// <summary>
        /// Creates a new instance of <see cref="TranslationController"/>.
        /// </summary>
        /// <param name="translationService"></param>
        /// <param name="pagingRetriever"></param>
        public TranslationController(TranslationService translationService, PagingRetriever pagingRetriever)
        {
            _translationService = translationService;
            _pagingRetriever = pagingRetriever;
        }

        /// <summary>
        /// Gets all translations.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]        
        [AllowAnonymous]
        [Route("{localeId}/{namespace}")]
        public async Task<ActionResult<Dictionary<string, string>>> GetTranslations(string localeId, string @namespace)
        {   
            var result = await _translationService.GetAllAsync(localeId, @namespace);
            
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets all translations.
        /// </summary>        
        /// <returns></returns>
        [HttpPost]        
        [Route("{localeId}/{namespace}")]
        public async Task<ActionResult> AddMissingTranslations(string localeId, string @namespace, [FromBody]Dictionary<string, string> data)
        {
            // to do: store missing translation            
            return this.CreateResponse(new Result(ResultCode.Success));
        }
    }
}