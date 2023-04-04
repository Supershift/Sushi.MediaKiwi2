using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    public class RoleRepository : IRoleRepository
    {
        private readonly IConnector<Role> _connector;

        public RoleRepository(IConnector<Role> connector)
        {
            _connector = connector;
        }

        public async Task<QueryListResult<Role>> GetAllAsync()
        {
            var query = _connector.CreateQuery();
            var result = await _connector.GetAllAsync(query);
            return result;
        }
    }
}
