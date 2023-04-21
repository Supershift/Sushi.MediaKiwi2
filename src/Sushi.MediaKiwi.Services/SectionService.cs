using AutoMapper;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Contains methods to interact with Section objects.
    /// </summary>
    public class SectionService
    {
        private readonly ISectionRepository _sectionRepository;
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
            _sectionRepository = repository;
            _mapper = mapper;
        }

        /// <summary>
        /// Deletes a section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result> DeleteAsync(int id)
        {
            // get item from datastore
            var section = await _sectionRepository.GetAsync(id);

            // todo: check if section is used by any navigation items?

            if (section != null)
            {
                // delete item
                await _sectionRepository.DeleteAsync(section.Id);
                return new Result(ResultCode.Success);
            }
            else
            {
                return new Result(ResultCode.NotFound);
            }
        }

        /// <summary>
        /// Gets all sections.
        /// </summary>
        /// <returns></returns>
        public async Task<Result<ListResult<Section>>> GetAllAsync(PagingValues pagingValues)
        {
            // get all sections from database
            var sections = await _sectionRepository.GetAllAsync(pagingValues);

            // map to result
            var result = new ListResult<Section>(sections.TotalNumberOfRows, sections.TotalNumberOfPages);
            _mapper.Map(sections, result.Result);

            return new Result<ListResult<Section>>(result);
        }

        public async Task<Result<Section>> GetAsync(int id)
        {
            // get item from datastore
            var section = await _sectionRepository.GetAsync(id);


            if (section != null)
            {
                // map to result
                var result = new Section();
                _mapper.Map(section, result);
                return new Result<Section>(result);
            }
            else
            {
                return new Result<Section>(ResultCode.NotFound);
            }
        }

        public async Task<Result<Section>> SaveAsync(int? id, Section request)
        {
            // get existing or create new section, based on id
            DAL.Section section;
            if (id.HasValue)
            {
                var candidate = await _sectionRepository.GetAsync(id.Value);
                if (candidate == null)
                {
                    return new Result<Section>(ResultCode.NotFound);
                }
                section = candidate;

            }
            else
            {
                section = new DAL.Section();
            }

            // map from model to database
            _mapper.Map(request, section);

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {

                // save section
                await _sectionRepository.SaveAsync(section);

                // commit transaction
                ts.Complete();
            }
            
            var result = new Section();
            _mapper.Map(section, result);
            return new Result<Section>(result);
        }
    }
}