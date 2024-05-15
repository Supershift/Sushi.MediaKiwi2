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
        Task<QueryListResult<Section>> GetAllAsync(PagingValues? pagingValues = null);

        /// <summary>
        /// Gets a <see cref="Section"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<Section?> GetAsync(string id);

        /// <summary>
        /// Inserts a <see cref="Section"/>.
        /// </summary>
        /// <param name="section"></param>
        /// <returns></returns>
        Task InsertAsync(Section section);

        /// <summary>
        /// Updates a <see cref="Section"/>.
        /// </summary>
        /// <param name="section"></param>
        /// <returns></returns>
        Task UpdateAsync(Section section);

        /// <summary>
        /// Deletes a <see cref="Section"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteAsync(string id);

        /// <summary>
        /// Updates the primary key of a <see cref="Section"/>.
        /// </summary>        
        Task UpdateIdAsync(string oldId, string newId);
    }
}