using AutoMapper;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Contains methods to interact with Section objects.
    /// </summary>
    public class SectionService
    {
        private readonly ISectionRepository _repository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="SectionService"/>.
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="mapper"></param>
        public SectionService(
            ISectionRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all sections.
        /// </summary>
        /// <returns></returns>
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