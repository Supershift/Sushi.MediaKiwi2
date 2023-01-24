using AutoMapper;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    public class SectionService
    {
        private readonly ISectionRepository _repository;
        private readonly IMapper _mapper;

        public SectionService(
            ISectionRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<Result<ListResult<Section>>> GetAllAsync()
        {
            // get all sections from database
            var sections = await _repository.GetAllAsync();

            // map to result
            var result = new ListResult<Section>(sections.TotalNumberOfRows, sections.TotalNumberOfPages);
            _mapper.Map(sections, result.Result);

            return new Result<ListResult<Section>>(result);
        }
    }
}