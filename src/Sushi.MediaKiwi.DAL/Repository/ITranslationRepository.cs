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
        /// Gets all <see cref="Translation"/> objects for a locale and namespace.
        /// </summary>
        /// <param name="localeId"></param>
        /// <param name="namespace"></param>
        /// <returns></returns>
        Task<QueryListResult<Translation>> GetAllAsync(string localeId, string @namespace);   
    }
}
