using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <inheritdoc/>    
    public class ViewRoleRepository : IViewRoleRepository
    {
        private readonly IConnector<ViewRole> _connector;

        /// <summary>
        /// Creates a new instance of <see cref="ViewRoleRepository"/>.
        /// </summary>
        public ViewRoleRepository(IConnector<ViewRole> connector)
        {
            _connector = connector;
        }

        /// <inheritdoc/>    
        public Task<QueryListResult<ViewRole>> GetAllAsync()
        {
            var query = _connector.CreateQuery();
            var result = _connector.GetAllAsync(query);
            return result;
        }
    }
}
