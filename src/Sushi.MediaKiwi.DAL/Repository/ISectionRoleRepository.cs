using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="SectionRole"/> objects.
    /// </summary>
    public interface ISectionRoleRepository
    {
        /// <summary>
        /// Gets all <see cref="SectionRole"/> objects for the given filters.
        /// </summary>
        /// <returns></returns>
        Task<QueryListResult<SectionRole>> GetAllAsync(int? sectionId);

        /// <summary>
        /// Deletes all role assignments for a section.
        /// </summary>
        /// <param name="sectionId"></param>
        /// <returns></returns>
        Task DeleteForSectionAsync(int sectionId);

        /// <summary>
        /// Inserts a role assignment.
        /// </summary>        
        /// <returns></returns>
        Task InsertAsync(SectionRole sectionRole);
    }
}
