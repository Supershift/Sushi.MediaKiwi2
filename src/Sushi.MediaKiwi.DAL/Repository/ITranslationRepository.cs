using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="Translation"/> objects.
    /// </summary>
    public interface ITranslationRepository
    {
        /// <summary>
        /// Gets all <see cref="Translation"/> objects for the given parameters
        /// </summary>        
        /// <returns></returns>
        Task<QueryListResult<Translation>> GetAllAsync(string? localeId, string? @namespace, string? key, string? value);

        /// <summary>
        /// Inserts a translation.
        /// </summary>
        /// <param name="translation"></param>
        /// <returns></returns>
        Task InsertAsync(Translation translation);

        /// <summary>
        /// Inserts a translation key for all locales that do not have that key yet.
        /// </summary>        
        /// <returns></returns>
        Task InsertMissingAsync(string @namespace, string key, string defaultValue);

        /// <summary>
        /// Duplicates all missing translations from a base locale to a target locale.
        /// </summary>
        /// <param name="baseLocaleId"></param>
        /// <param name="targetLocaleId"></param>
        /// <returns></returns>
        Task DuplicateAsync(string baseLocaleId, string targetLocaleId);

        /// <summary>
        /// Gets a translation.
        /// </summary>
        /// <param name="localeId"></param>
        /// <param name="namespace"></param>
        /// <param name="key"></param>
        /// <returns></returns>
        Task<Translation?> GetAsync(string localeId, string @namespace, string key);
        
        /// <summary>
        /// Updates a translation.
        /// </summary>
        /// <param name="translation"></param>
        /// <returns></returns>
        Task UpdateAsync(Translation translation);
        
        /// <summary>
        /// Deletes a translation.
        /// </summary>
        /// <param name="translation"></param>
        /// <returns></returns>
        Task DeleteAsync(Translation translation);

        /// <summary>
        /// Gets all distinct namespaces.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        Task<List<string?>> GetNamespacesAsync(string? localeId);

        /// <summary>
        /// Gets all distinct keys.
        /// </summary>
        /// <param name="localeId"></param>
        /// <returns></returns>
        Task<List<string?>> GetKeysAsync(string? localeId);
    }
}
