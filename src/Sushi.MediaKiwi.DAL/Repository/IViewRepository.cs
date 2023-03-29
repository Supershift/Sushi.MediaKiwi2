using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="View"/> objects.
    /// </summary>
    public interface IViewRepository
    {
        /// <summary>
        /// Gets all screens for the given filter parameters.
        /// </summary>        
        /// <returns></returns>
        Task<QueryListResult<View>> GetAllAsync(int? sectionID, PagingValues pagingValues);
    }
}