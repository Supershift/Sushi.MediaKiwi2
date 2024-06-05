using Sushi.MediaKiwi.Services.Entities;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.Interfaces
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
        /// <param name="sortValues"></param>
        /// <returns></returns>
        Task<QueryListResult<NavigationItem>> GetAllAsync(string? sectionID, PagingValues pagingValues, SortValues<NavigationItem>? sortValues = null);

        /// <summary>
        /// Gets a <see cref="NavigationItem"/> by id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<NavigationItem?> GetAsync(string id);

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
        Task DeleteAsync(string id);

        /// <summary>
        /// Updates the primary key of a <see cref="NavigationItem"/>, including all child navigation items' reference to it.
        /// </summary>
        /// <param name="oldId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        Task UpdateIdAsync(string oldId, string newId);
    }
}