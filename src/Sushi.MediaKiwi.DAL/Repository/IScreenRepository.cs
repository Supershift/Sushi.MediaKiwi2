using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="Screen"/> objects.
    /// </summary>
    public interface IScreenRepository
    {
        /// <summary>
        /// Gets all screens for the given filter parameters.
        /// </summary>        
        /// <returns></returns>
        Task<QueryListResult<Screen>> GetAllAsync(int? sectionID, PagingValues pagingValues);
    }
}