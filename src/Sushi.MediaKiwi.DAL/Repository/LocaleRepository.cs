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
        public Task<QueryListResult<Locale>> GetAllAsync(bool onlyEnabled, PagingValues? pagingValues)
        {
            var query = _connector.CreateQuery();
            if (onlyEnabled)
                query.Add(x => x.IsEnabled, true);

            if (pagingValues != null)
                query.AddPaging(pagingValues);

            var result = _connector.GetAllAsync(query);
            return result;
        }
    }
}
