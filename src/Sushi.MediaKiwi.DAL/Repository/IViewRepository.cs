using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Sorting;
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
        Task<QueryListResult<View>> GetAllAsync(int? sectionID, PagingValues pagingValues, SortValues<View>? sortValues = null);

        /// <summary>
        /// Gets a <see cref="View"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<View?> GetAsync(string id);

        /// <summary>
        /// Inserts a <see cref="View"/>.
        /// </summary>
        /// <param name="view"></param>
        /// <returns></returns>
        Task InsertAsync(View view);

        /// <summary>
        /// Updates a <see cref="View"/>.
        /// </summary>
        /// <param name="view"></param>
        /// <returns></returns>
        Task UpdateAsync(View view);

        /// <summary>
        /// Deletes a <see cref="View"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteAsync(string id);
    }
}