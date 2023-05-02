using Sushi.MediaKiwi.DAL.Paging;
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

        public async Task<QueryListResult<Country>> GetAllAsync(PagingValues pagingValues)
        {
            var query = _connector.CreateQuery();
            query.AddPaging(pagingValues);
            query.AddOrder(x => x.Name);
            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
