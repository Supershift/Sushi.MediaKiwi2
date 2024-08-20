using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Represents values used when paging datasets.
    /// </summary>    
    /// <param name="PageIndex">Zero based index of the page</param>
    /// <param name="PageSize">Number of items on the page</param>
    public record PagingValues(int PageIndex, int PageSize)
    {
        /// <summary>
        /// Gets a <see cref="PagingValues"/> instance with default values (pagesize = 10, index = 0).
        /// </summary>
        public static readonly PagingValues Default = new PagingValues(0, 10);
    }
}
