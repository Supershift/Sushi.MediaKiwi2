using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Paging;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to retrieve Translations.
    /// </summary>
    [Route($"{BaseRoute}/translations")]
    public class TranslationController : MediaKiwiControllerBase
    {
        private readonly TranslationService _translationService;        

        /// <summary>
        /// Creates a new instance of <see cref="TranslationController"/>.
        /// </summary>        
        public TranslationController(TranslationService translationService)
        {
            _translationService = translationService;            
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
            if (data.Any() == false) {
                return this.CreateResponse(new Result(ResultCode.ValidationFailed));
            }
            var result = await _translationService.AddMissingAsync(localeId, @namespace, data.First().Key, data.First().Value);
            return this.CreateResponse(result);
        }
    }
}