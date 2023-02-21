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
    }
}