using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>
    public class RoleRepository : IRoleRepository
    {
        private readonly IConnector<Role> _connector;
        
        /// <summary>
        /// Creates a new instance of <see cref="RoleRepository"/>.
        /// </summary>
        /// <param name="connector"></param>
        public RoleRepository(IConnector<Role> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>
        public async Task<QueryListResult<Role>> GetAllAsync()
        {
            var query = _connector.CreateQuery();
            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
