using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>
    public class TranslationRepository : ITranslationRepository
    {
        private readonly IConnector<Translation> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="TranslationRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public TranslationRepository(IConnector<Translation> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>
        public Task<QueryListResult<Translation>> GetAllAsync(string localeId, string @namespace)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.LocaleId, localeId);
            query.Add(x => x.Namespace, @namespace);
            query.AddOrder(x => x.Key);
            var result = _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritdoc/>
        public async Task InsertAsync(Translation translation)
        {
            await _connector.InsertAsync(translation);
        }
    }
}
