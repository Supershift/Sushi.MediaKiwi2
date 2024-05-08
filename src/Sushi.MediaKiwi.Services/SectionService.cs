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
        private readonly ISectionRoleRepository _sectionRoleRepository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="SectionService"/>.
        /// </summary>        
        public SectionService(
            ISectionRepository repository,
            ISectionRoleRepository sectionRoleRepository,
            IMapper mapper)
        {
            _sectionRepository = repository;
            _sectionRoleRepository = sectionRoleRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Deletes a section.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result> DeleteAsync(string id)
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
            var items = await _sectionRepository.GetAllAsync(pagingValues);
            var sectionRoles = await _sectionRoleRepository.GetAllAsync(null);

            // map to result
            var itemsDto = _mapper.Map<List<Section>>(items);

            // create result object
            var result = new ListResult<Section>(itemsDto, items);

            // add roles
            foreach (var section in result.Result)
            {
                section.Roles = sectionRoles.Where(x => x.SectionId == section.Id).Select(x => x.Role).ToList();
            }

            return new Result<ListResult<Section>>(result);
        }

        public async Task<Result<Section>> GetAsync(string id)
        {
            // get item from datastore
            var section = await _sectionRepository.GetAsync(id);

            if (section != null)
            {
                var sectionRoles = await _sectionRoleRepository.GetAllAsync(section.Id);

                // map to result                 
                var result = _mapper.Map<Section>(section);
                result.Roles = sectionRoles.Where(x => x.SectionId == section.Id).Select(x => x.Role).ToList();

                return new Result<Section>(result);
            }
            else
            {
                return new Result<Section>(ResultCode.NotFound);
            }
        }

        public async Task<Result<Section>> SaveAsync(string? id, Section request)
        {
            // get existing or create new section, based on id
            DAL.Section section;
            if (id != null)
            {
                var candidate = await _sectionRepository.GetAsync(id);
                if (candidate == null)
                {
                    return new Result<Section>(ResultCode.NotFound);
                }
                section = candidate;

            }
            else
            {
                section = new DAL.Section() { Id = request.Id };
            }

            // map from model to database
            _mapper.Map(request, section);

            // start transaction
            using (var ts = DAL.Utility.CreateTransactionScope())
            {
                if (id != null)
                {
                    // existing section
                    // delete existing roles
                    await _sectionRoleRepository.DeleteForSectionAsync(id);
                    await _sectionRepository.UpdateAsync(section);
                }
                else
                {
                    // new section
                    await _sectionRepository.InsertAsync(section);
                }

                // insert roles for view
                foreach (var role in request.Roles)
                {
                    var sectionRole = new DAL.SectionRole() { Role = role, SectionId = section.Id };
                    await _sectionRoleRepository.InsertAsync(sectionRole);
                }

                // commit transaction
                ts.Complete();
            }
             
            var result = _mapper.Map<Section>(section);
            return new Result<Section>(result);
        }
    }
}