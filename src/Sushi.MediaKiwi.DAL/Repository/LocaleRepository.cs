using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritDoc />
    public class LocaleRepository : ILocaleRepository
    {
        private readonly IConnector<Locale> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="LocaleRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public LocaleRepository(IConnector<Locale> connector)
        {
            _connector = connector;
        }

        /// <inheritDoc />
        public async Task DeleteAsync(Locale locale)
        {
            await _connector.DeleteAsync(locale);
        }

        /// <inheritDoc />
        public async Task<QueryListResult<Locale>> GetAllAsync(bool onlyEnabled, PagingValues? pagingValues)
        {
            var query = _connector.CreateQuery();
            if (onlyEnabled)
                query.Add(x => x.IsEnabled, true);

            if (pagingValues != null)
                query.AddPaging(pagingValues);

            var result = await _connector.GetAllAsync(query);
            return result;
        }

        /// <inheritDoc />
        public async Task<Locale?> GetAsync(string id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        /// <inheritDoc />
        public async Task<Locale?> GetDefaultAsync()
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.IsDefault, true);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        /// <inheritDoc />
        public async Task InsertAsync(Locale locale)
        {
            await _connector.InsertAsync(locale);
        }

        /// <inheritDoc />
        public async Task UpdateAsync(Locale locale)
        {
            await _connector.UpdateAsync(locale);
        }
    }
}
