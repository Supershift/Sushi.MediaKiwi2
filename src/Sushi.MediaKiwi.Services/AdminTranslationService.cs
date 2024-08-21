using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides methods to interact with <see cref="Translation"/> objects.
    /// </summary>
    public class AdminTranslationService
    {
        private readonly ITranslationRepository _translationRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="TranslationService"/>.
        /// </summary>
        /// <param name="translationRepository"></param>
        /// <param name="mapper"></param>
        public AdminTranslationService(ITranslationRepository translationRepository, IMapper mapper)
        {
            _translationRepository = translationRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all namespaces.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        public async Task<Result<ListResult<string?>, Error>> GetNamespacesAsync(string? localeId)
        {
            var namespaces = await _translationRepository.GetNamespacesAsync(localeId);
            return new ListResult<string?>(namespaces);
        }

        /// <summary>
        /// Gets all keys.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        public async Task<Result<ListResult<string?>, Error>> GetKeysAsync(string? localeId)
        {
            var namespaces = await _translationRepository.GetKeysAsync(localeId);
            return new ListResult<string?>(namespaces);
        }

        /// <summary>
        /// Gets all <see cref="Translation"/> instances meeting the supplied filter parameters.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<Translation>, Error>> GetAllAsync(string? localeId, string? @namespace, string? key, string? value)
        {
            // get translations from repository
            var translations = await _translationRepository.GetAllAsync(localeId, @namespace, key, value);

            // map to result
            var result = _mapper.Map<List<Translation>>(translations);

            return new ListResult<Translation>(result);
        }

        /// <summary>
        /// Updates the value of a translation.
        /// </summary>
        public async Task<Result<Error>> UpdateTranslationAsync(string localeId, string @namespace, string key, UpdateTranslationRequest request)
        {
            // get existing translation
            var translation = await _translationRepository.GetAsync(localeId, @namespace, key);

            if (translation == null)
                return new NotFoundError();

            // update translation
            translation.Value = request.Value;
            await _translationRepository.UpdateAsync(translation);

            return Result.Success<Error>();
        }

        /// <summary>
        /// Deletes a translation.
        /// </summary>
        /// <param name="localeId"></param>
        /// <param name="namespace"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public async Task<Result<Error>> DeleteTranslationAsync(string localeId, string @namespace, string key)
        {
            // get existing translation
            var translation = await _translationRepository.GetAsync(localeId, @namespace, key);

            if (translation == null)
                return new NotFoundError();

            // delete translation            
            await _translationRepository.DeleteAsync(translation);

            return Result.Success<Error>();
        }
    }
}
