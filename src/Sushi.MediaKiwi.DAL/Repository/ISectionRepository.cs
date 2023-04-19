using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to read and write <see cref="Section"/> objects.
    /// </summary>
    public interface ISectionRepository
    {
        /// <summary>
        /// Gets all sections from the database.
        /// </summary>
        /// <returns></returns>
        Task<QueryListResult<Section>> GetAllAsync(PagingValues pagingValues);

        /// <summary>
        /// Gets a <see cref="Section"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<Section?> GetAsync(int id);

        /// <summary>
        /// Insert or updates a <see cref="Section"/>.
        /// </summary>
        /// <param name="section"></param>
        /// <returns></returns>
        Task SaveAsync(Section section);

        /// <summary>
        /// Deletes a <see cref="Section"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteAsync(int id);
    }
}