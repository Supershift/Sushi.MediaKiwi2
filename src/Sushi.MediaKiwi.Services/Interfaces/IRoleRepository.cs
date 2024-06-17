using Sushi.MediaKiwi.Services.Entities;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Interfaces
{
    /// <summary>
    /// Provides methods to work with <see cref="Role"/>.
    /// </summary>
    public interface IRoleRepository
    {
        /// <summary>
        /// Gets all <see cref="Role"/> instances from a datastore.
        /// </summary>
        /// <returns></returns>
        Task<QueryListResult<Role>> GetAllAsync();
    }
}
