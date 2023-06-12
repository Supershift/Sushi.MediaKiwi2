using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Repository
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
