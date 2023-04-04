using AutoMapper;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Contains methods to interact with Role objects.
    /// </summary>
    public class RoleService
    {
        private readonly IRoleRepository _repository;
        private readonly IMapper _mapper;

        /// <summary>
        /// Creates a new instance of <see cref="RoleService"/>.
        /// </summary>
        /// <param name="repository"></param>
        /// <param name="mapper"></param>
        public RoleService(
            IRoleRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets all roles.
        /// </summary>
        /// <returns></returns>
        public async Task<Result<ListResult<Role>>> GetAllAsync()
        {
            // get all roles from database
            var roles = await _repository.GetAllAsync();

            // map to result
            var result = new ListResult<Role>(roles.TotalNumberOfRows, roles.TotalNumberOfPages);
            _mapper.Map(roles, result.Result);

            return new Result<ListResult<Role>>(result);
        }
    }
}