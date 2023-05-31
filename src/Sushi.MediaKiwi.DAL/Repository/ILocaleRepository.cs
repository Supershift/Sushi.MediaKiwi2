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
    }
}
