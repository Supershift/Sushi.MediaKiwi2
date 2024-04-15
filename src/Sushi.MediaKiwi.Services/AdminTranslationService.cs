using AutoMapper;
using Microsoft.Extensions.Primitives;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public async Task<Result<ListResult<string?>>> GetNamespacesAsync(string? localeId)
        {
            var namespaces = await _translationRepository.GetNamespacesAsync(localeId);
            return new Result<ListResult<string?>>(new ListResult<string?>(namespaces));               
        }

        /// <summary>
        /// Gets all keys.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        public async Task<Result<ListResult<string?>>> GetKeysAsync(string? localeId)
        {
            var namespaces = await _translationRepository.GetKeysAsync(localeId);
            return new Result<ListResult<string?>>(new ListResult<string?>(namespaces));
        }

        /// <summary>
        /// Gets all <see cref="Translation"/> instances meeting the supplied filter parameters.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result<ListResult<Translation>>> GetAllAsync(string? localeId, string? @namespace, string? key, string? value)
        {
            // get translations from repository
            var translations = await _translationRepository.GetAllAsync(localeId, @namespace, key, value);

            // map to result
            var result = _mapper.Map<List<Translation>>(translations);

            return new Result<ListResult<Translation>>(new ListResult<Translation>(result));
        }

        /// <summary>
        /// Updates the value of a translation.
        /// </summary>
        public async Task<Result> UpdateTranslationAsync(string localeId, string @namespace, string key, UpdateTranslationRequest request)
        {
            // get existing translation
            var translation = await _translationRepository.GetAsync(localeId, @namespace, key);

            if (translation == null)
                return new Result(ResultCode.NotFound);

            // update translation
            translation.Value = request.Value;
            await _translationRepository.UpdateAsync(translation);

            return new Result(ResultCode.Success);
        }

        /// <summary>
        /// Deletes a translation.
        /// </summary>
        /// <param name="localeId"></param>
        /// <param name="namespace"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        public async Task<Result> DeleteTranslationAsync(string localeId, string @namespace, string key)
        {
            // get existing translation
            var translation = await _translationRepository.GetAsync(localeId, @namespace, key);

            if (translation == null)
                return new Result(ResultCode.NotFound);

            // delete translation            
            await _translationRepository.DeleteAsync(translation);

            return new Result(ResultCode.Success);
        }
    }
}
