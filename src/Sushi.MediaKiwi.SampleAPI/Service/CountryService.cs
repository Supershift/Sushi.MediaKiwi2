using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
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

        public async Task<Result<ListResult<Country>, Error>> GetAllAsync(PagingValues paging)
        {
            // get countries from datastore
            var items = await _countryRepository.GetAllAsync(paging);

            // map to result
            var itemsDto = _mapper.Map<List<Country>>(items);

            // create result object
            var result = new ListResult<Country>(itemsDto, items);

            return result;
        }
    }
}
