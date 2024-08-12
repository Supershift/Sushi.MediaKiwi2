using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.Services;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.SampleAPI.DAL.Repository
{
    public class CountryRepository
    {
        private readonly IConnector<Country> _connector;

        public CountryRepository(IConnector<Country> connector)
        {
            _connector = connector;
        }

        public async Task<QueryListResult<Country>> GetAllAsync(PagingValues? pagingValues, SortValues<Country>? sorting)
        {
            var query = _connector.CreateQuery();

            if (pagingValues is not null)
            {
                query.AddPaging(pagingValues);
            }

            if (sorting is not null)
            {
                query.AddOrder(sorting);
            }
            else
            {
            query.AddOrder(x => x.Name);
            }
            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
