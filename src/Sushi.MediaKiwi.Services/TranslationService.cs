using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides methods to interact with translations.
    /// </summary>
    public class TranslationService
    {
        private readonly ITranslationRepository _translationRepository;

        /// <summary>
        /// Creates a new instance of <see cref="TranslationService"/>.
        /// </summary>                
        public TranslationService(ITranslationRepository translationRepository)
        {
            _translationRepository = translationRepository;
        }

        /// <summary>
        /// Gets all <see cref="Translation"/> instances.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<Dictionary<string, string>>> GetAllAsync(string localeId, string @namespace)
        {
            // get translations from repository
            var translations = await _translationRepository.GetAllAsync(localeId, @namespace, null, null);

            // map to result
            var result = new Dictionary<string, string>();
            foreach (var translation in translations)
            {
                result.Add(translation.Key, translation.Value);
            }

            return new Result<Dictionary<string, string>>(result);
        }

        /// <summary>
        /// Adds a missing <see cref="Translation"/> instances.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result> AddMissingAsync(string originalLocaleId, string @namespace, string key, string value)
        {
            await _translationRepository.InsertMissingAsync(@namespace, key, value);

            return new Result(ResultCode.Success);
        }
    }
}
