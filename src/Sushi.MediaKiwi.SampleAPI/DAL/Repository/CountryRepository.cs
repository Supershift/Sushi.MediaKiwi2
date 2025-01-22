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

        public async Task<QueryListResult<Country>> GetAllAsync(string? countryCode, string? countryName, PagingValues pagingValues)
        {
            var query = _connector.CreateQuery();
            if(!string.IsNullOrWhiteSpace(countryName))
                query.Add(x => x.Name, $"%{countryName}%", ComparisonOperator.Like);
            
            if(!string.IsNullOrWhiteSpace(countryCode))
                query.Add(x => x.Code, countryCode);

            query.AddPaging(pagingValues);
            query.AddOrder(x => x.Name);
            var result = await _connector.GetAllAsync(query);
            return result;
        }

        public async Task<Country?> GetCountryAsync(string code)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Code, code);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }
    }
}
