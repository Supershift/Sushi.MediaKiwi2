using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="ScreenRole"/> objects.
    /// </summary>
    public interface IScreenRoleRepository
    {
        /// <summary>
        /// Gets all <see cref="ScreenRole"/> objects for the given filters.
        /// </summary>
        /// <returns></returns>
        Task<QueryListResult<ScreenRole>> GetAllAsync();
    }
}
