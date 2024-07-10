using AutoMapper;
using Sushi.LanguageExtensions;
using Sushi.LanguageExtensions.Errors;
using Sushi.MediaKiwi.Services.Interfaces;
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
        public async Task<Result<Error>> DeleteAsync(string id)
        {
            // get item from datastore
            var section = await _sectionRepository.GetAsync(id);

            // todo: check if section is used by any navigation items?

            if (section != null)
            {
                // delete item
                await _sectionRepository.DeleteAsync(section.Id);
                return Result<Error>.Success();
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Gets all sections.
        /// </summary>
        /// <returns></returns>
        public async Task<Result<ListResult<Section>, Error>> GetAllAsync(PagingValues pagingValues)
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

            return result;
        }

        /// <summary>
        /// Gets a single <see cref="Section"/> by its ID.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<Result<Section, Error>> GetAsync(string id)
        {
            // get item from datastore
            var section = await _sectionRepository.GetAsync(id);

            if (section != null)
            {
                var sectionRoles = await _sectionRoleRepository.GetAllAsync(section.Id);

                // map to result                 
                var result = _mapper.Map<Section>(section);
                result.Roles = sectionRoles.Where(x => x.SectionId == section.Id).Select(x => x.Role).ToList();

                return result;
            }
            else
            {
                return new NotFoundError();
            }
        }

        /// <summary>
        /// Updates a section.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<Result<Section, Error>> UpdateAsync(string id, Section request)
        {
            // get existing or create new section, based on id
            var section = await _sectionRepository.GetAsync(id);
            if (section == null)
            {
                return new NotFoundError();
            }

            // map from model to database
            _mapper.Map(request, section);

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {
                // delete existing roles
                await _sectionRoleRepository.DeleteForSectionAsync(id);

                // update section
                await _sectionRepository.UpdateAsync(section);

                // insert roles for view
                foreach (var role in request.Roles)
                {
                    var sectionRole = new Entities.SectionRole() { Role = role, SectionId = section.Id };
                    await _sectionRoleRepository.InsertAsync(sectionRole);
                }

                // commit transaction
                ts.Complete();
            }

            var result = _mapper.Map<Section>(section);
            return new Result<Section, Error>(result);
        }

        /// <summary>
        /// Creates a new <see cref="Section"/>.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        public async Task<Result<Section, Error>> CreateAsync(string id, Section request)
        {
            // sanitize input
            id = id.Trim();
            
            var section = new Entities.Section() { Id = id };

            // map from model to database
            _mapper.Map(request, section);

            // start transaction
            using (var ts = TransactionUtility.CreateTransactionScope())
            {

                // new section
                await _sectionRepository.InsertAsync(section);


                // insert roles for view
                foreach (var role in request.Roles)
                {
                    var sectionRole = new Entities.SectionRole() { Role = role, SectionId = section.Id };
                    await _sectionRoleRepository.InsertAsync(sectionRole);
                }

                // commit transaction
                ts.Complete();
            }

            var result = _mapper.Map<Section>(section);
            return result;
        }

        /// <summary>
        /// Changes the ID of a section.
        /// </summary>
        /// <param name="oldId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public async Task<Result<Section, Error>> UpdateIdAsync(string oldId, string newId)
        {
            // sanitize input
            newId = newId.Trim();

            // get item from datastore
            var section = await _sectionRepository.GetAsync(oldId);

            if (section == null)
            {
                return new NotFoundError();
            }

            // change id             
            await _sectionRepository.UpdateIdAsync(section.Id, newId);

            // return new section
            return await GetAsync(newId);
        }
    }
}