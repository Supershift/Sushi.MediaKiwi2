using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>    
    public class ScreenRoleRepository : IScreenRoleRepository
    {
        private readonly IConnector<ScreenRole> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="ScreenRoleRepository"/>.
        /// </summary>
        public ScreenRoleRepository(IConnector<ScreenRole> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>    
        public Task<QueryListResult<ScreenRole>> GetAllAsync()
        {
            var query = _connector.CreateQuery();
            var result = _connector.GetAllAsync(query);
            return result;
        }
    }
}
