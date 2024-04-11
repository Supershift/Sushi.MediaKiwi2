using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.Repository
{
    /// <summary>
    /// Provides methods to work with <see cref="NavigationItem"/>.
    /// </summary>
    public interface INavigationItemRepository
    {
        /// <summary>
        /// Gets <see cref="NavigationItem"/> instances from a datastore.
        /// </summary>
        /// <param name="sectionID"></param>
        /// <param name="pagingValues"></param>
        /// <returns></returns>
        Task<QueryListResult<NavigationItem>> GetAllAsync(int? sectionID, PagingValues pagingValues);
        
        /// <summary>
        /// Gets a <see cref="NavigationItem"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<NavigationItem?> GetAsync(int id);

        /// <summary>
        /// Inserts a <see cref="NavigationItem"/>.
        /// </summary>
        /// <param name="navigationItem"></param>
        /// <returns></returns>
        Task InsertAsync(NavigationItem navigationItem);

        /// <summary>
        /// Updates a <see cref="NavigationItem"/>.
        /// </summary>
        /// <param name="navigationItem"></param>
        /// <returns></returns>
        Task UpdateAsync(NavigationItem navigationItem);

        /// <summary>
        /// Deletes a <see cref="NavigationItem"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task DeleteAsync(int id);
    }
}