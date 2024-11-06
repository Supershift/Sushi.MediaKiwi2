using Sushi.MicroORM;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.SampleAPI.Domain;

namespace Sushi.MediaKiwi.SampleAPI.DAL.Repository
{
    public class HotelRepository
    {
        private readonly IConnector<Hotel> _connector;

        public HotelRepository(IConnector<Hotel> connector)
        {
            _connector = connector;
        }

        public async Task<QueryListResult<Hotel>> GetAllAsync(PagingValues pagingValues, string? countryCode, bool? isActive)
        {
            var query = _connector.CreateQuery();
            query.AddPaging(pagingValues);
            query.AddOrder(x => x.Name);

            if (string.IsNullOrWhiteSpace(countryCode) == false)
            {
                query.Add(x => x.CountryCode, countryCode);
            }

            if (isActive.HasValue)
            {
                query.Add(x => x.IsActive, isActive.Value);
            }

            var result = await _connector.GetAllAsync(query);
            return result;
        }

        public async Task<Hotel?> GetAsync(int id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            var result = await _connector.GetFirstAsync(query);
            return result;
        }

        public async Task<Hotel> SaveAsync(Hotel hotel)
        {
            await _connector.SaveAsync(hotel);
            return hotel;
        }

        public async Task DeleteAsync(int id)
        {
            var query = _connector.CreateQuery();
            query.Add(x => x.Id, id);
            await _connector.DeleteAsync(query);
        }
    }
}
