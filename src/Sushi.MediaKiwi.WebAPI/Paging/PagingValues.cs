using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Represents values used when paging datasets.
    /// </summary>
    public class PagingValues
    {
        /// <summary>
        /// Creates a new instance of <see cref="PagingValues"/>.
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        public PagingValues(int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
        }
        
        /// <summary>
        /// Gets the request zero based index.
        /// </summary>
        public int PageIndex { get; }

        /// <summary>
        /// Gets the number of items per page.
        /// </summary>
        public int PageSize { get; }
    }
}
