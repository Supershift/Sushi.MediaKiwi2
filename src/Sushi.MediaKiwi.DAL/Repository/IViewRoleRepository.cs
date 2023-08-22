using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="ViewRole"/> objects.
    /// </summary>
    public interface IViewRoleRepository
    {
        /// <summary>
        /// Gets all <see cref="ViewRole"/> objects for the given filters.
        /// </summary>
        /// <returns></returns>
        Task<QueryListResult<ViewRole>> GetAllAsync(string? viewId);

        /// <summary>
        /// Deletes all role assignments for a view.
        /// </summary>
        /// <param name="viewId"></param>
        /// <returns></returns>
        Task DeleteForViewAsync(string viewId);

        /// <summary>
        /// Inserts a role assignment.
        /// </summary>        
        /// <returns></returns>
        Task InsertAsync(ViewRole viewRole);
    }
}
