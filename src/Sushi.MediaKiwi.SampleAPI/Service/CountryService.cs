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

            // map to result
            var itemsDto = _mapper.Map<List<Country>>(items);

            // create result object
            var result = new ListResult<Country>(itemsDto, items);            
            
            return new Result<ListResult<Country>>(result);
        }
    }
}
