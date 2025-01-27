using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Defines endpoints to manage translations.
    /// </summary>
    [Route($"{BaseRoute}/admin/translations/")]
    [Authorize(Policy = Constants.AdminPolicyName)]
    public class AdminTranslationController : MediaKiwiControllerBase
    {
        private readonly AdminTranslationService _translationService;

        /// <summary>
        /// Creates a new instance of <see cref="TranslationController"/>.
        /// </summary>
        /// <param name="translationService"></param>
        public AdminTranslationController(AdminTranslationService translationService)
        {
            _translationService = translationService;
        }

        /// <summary>
        /// Gets all translations for a namespace.
        /// </summary>        
        /// <returns></returns>
        [HttpGet]                
        public async Task<ActionResult<ListResult<Translation>>> GetTranslations(string? localeId, string? @namespace, string? key, string? value)
        {   
            var result = await _translationService.GetAllAsync(localeId, @namespace, key, value);           
            return this.ToResponse(result);
        }

        /// <summary>
        /// Gets all namespaces for a locale.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("namespaces")]
        public async Task<ActionResult<ListResult<string?>>> GetNamespaces(string? localeId)
        {
            var result = await _translationService.GetNamespacesAsync(localeId);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Gets all keys for a locale.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("keys")]
        public async Task<ActionResult<ListResult<string?>>> GetKeys(string? localeId)
        {
            var result = await _translationService.GetKeysAsync(localeId);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Updates the value of an existing translation.
        /// </summary>        
        /// <returns></returns>
        [HttpPut]
        [Route("{localeId}/{namespace}/{key}")]
        public async Task<ActionResult> UpdateTranslation(string localeId, string @namespace, string key, UpdateTranslationRequest request)
        {
            var result = await _translationService.UpdateTranslationAsync(localeId, @namespace, key, request);
            return this.ToResponse(result);
        }

        /// <summary>
        /// Deletes a translation.
        /// </summary>
        /// <param name="localeId"></param>
        /// <param name="namespace"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{localeId}/{namespace}/{key}")]
        public async Task<ActionResult> DeleteTranslation(string localeId, string @namespace, string key)
        {
            var result = await _translationService.DeleteTranslationAsync(localeId, @namespace, key);
            return this.ToResponse(result);
        }
    }
}