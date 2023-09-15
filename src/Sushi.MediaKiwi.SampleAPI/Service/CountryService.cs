using AutoMapper;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.SampleAPI.DAL.Repository;
using Sushi.MediaKiwi.SampleAPI.Service.Model;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.SampleAPI.Service
{
    public class CountryService
    {
        private readonly CountryRepository _countryRepository;
        private readonly IMapper _mapper;

        public CountryService(
            CountryRepository countryRepository,
            IMapper mapper)
        {
            _countryRepository = countryRepository;
            _mapper = mapper;
        }

        public async Task<Result<ListResult<Country>>> GetAllAsync(PagingValues pagingValues)
        {
            // get countries from datastore
            var items = await _countryRepository.GetAllAsync(pagingValues);
            // create result object
            var result = new ListResult<Country>(items.TotalNumberOfRows, items.TotalNumberOfPages);
            // map to result
            _mapper.Map(items, result.Result);
            return new Result<ListResult<Country>>(result);
        }


        /// <summary>
        /// Saves a single Hotel to the database
        /// </summary>
        /// <param name="id">The Id of the hotel to save, or NULL when creating a new one</param>
        /// <param name="request">The request containing all hotel information</param>
        /// <returns></returns>
        public async Task<Result<Country>> UpdateAsync(string code, Country request)
        {
            // get existing or create new hotel, based on id
            DAL.Country country;
            var candidate = await _countryRepository.GetAsync(code);
            if (candidate == null)
            {
                return new Result<Country>(ResultCode.NotFound);
            }
            country = candidate;

            // map from model to database
            _mapper.Map(request, country);

            // start transaction
            using (var ts = MediaKiwi.DAL.Utility.CreateTransactionScope())
            {
                // save hotel
                await _countryRepository.UpdateAsync(country);

                // commit transaction
                ts.Complete();
            }

            var result = new Country();
            _mapper.Map(country, result);
            return new Result<Country>(result);
        }
    }
}
