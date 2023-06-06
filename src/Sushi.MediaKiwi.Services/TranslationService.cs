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
    public class TranslationService
    {
        private readonly ITranslationRepository _translationRepository;        

        /// <summary>
        /// Creates a new instance of <see cref="TranslationService"/>.
        /// </summary>
        /// <param name="translationRepository"></param>
        /// <param name="mapper"></param>
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
            var translations = await _translationRepository.GetAllAsync(localeId, @namespace);

            // map to result
            var result = new Dictionary<string, string>();
            foreach(var translation in translations)
            {
                result.Add(translation.Key, translation.Value);
            }

            return new Result<Dictionary<string, string>>(result);
        }

        /// <summary>
        /// Gets all <see cref="Translation"/> instances.
        /// </summary>        
        /// <returns></returns>
        public async Task<Result> AddAsync(string localeId, string @namespace, string key, string value)
        {
            // map input to dal
            var translation = new DAL.Translation()
            {
                Key = key,
                LocaleId = localeId,
                Namespace = @namespace,
                Value = value
            };

            await _translationRepository.InsertAsync(translation);

            return new Result(ResultCode.Success);
        }
    }
}
