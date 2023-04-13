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
        /// Gets all <see cref="View"/> objects for the given filter parameters.
        /// </summary>        
        /// <returns></returns>
        Task<QueryListResult<View>> GetAllAsync(int? sectionID, PagingValues pagingValues);

        /// <summary>
        /// Gets a <see cref="View"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<View?> GetAsync(int id);

        /// <summary>
        /// Insert or updates a <see cref="View"/>.
        /// </summary>
        /// <param name="view"></param>
        /// <returns></returns>
        Task SaveAsync(View view);

        /// <summary>
        /// Deletes a <see cref="View"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteAsync(int id);
    }
}