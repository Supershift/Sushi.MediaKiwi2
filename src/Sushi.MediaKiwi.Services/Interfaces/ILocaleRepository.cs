using Sushi.MediaKiwi.Services.Entities;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.Interfaces
{
    /// <summary>
    /// Provides methods to read and write <see cref="Locale"/> objects.
    /// </summary>
    public interface ILocaleRepository
    {
        /// <summary>
        /// Gets <see cref="Locale"/> instances from a datastore.
        /// </summary>        
        /// <returns></returns>
        Task<QueryListResult<Locale>> GetAllAsync(bool onlyEnabled, PagingValues? pagingValues);

        /// <summary>
        /// Gets a <see cref="Locale"/> instance.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<Locale?> GetAsync(string id);

        /// <summary>
        /// Gets the default <see cref="Locale"/>.
        /// </summary>
        /// <returns></returns>
        Task<Locale?> GetDefaultAsync();

        /// <summary>
        /// Inserts a new <see cref="Locale"/> instance.
        /// </summary>
        /// <param name="locale"></param>
        /// <returns></returns>
        Task InsertAsync(Locale locale);

        /// <summary>
        /// Updates an existing <see cref="Locale"/> instance.
        /// </summary>
        /// <param name="locale"></param>
        /// <returns></returns>
        Task UpdateAsync(Locale locale);

        /// <summary>
        /// Deletes a <see cref="Locale"/> instance.
        /// </summary>
        /// <param name="locale"></param>
        /// <returns></returns>
        Task DeleteAsync(Locale locale);


    }
}
