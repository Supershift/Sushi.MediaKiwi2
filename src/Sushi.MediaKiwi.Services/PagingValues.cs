using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Represents values used when paging datasets.
    /// </summary>    
    /// <param name="PageIndex">Zero based index of the page</param>
    /// <param name="PageSize">Number of items on the page</param>
    public record PagingValues(int PageIndex = 0, int PageSize = 10)
    {
        /// <summary>
        /// Gets a <see cref="PagingValues"/> instance with default values (pagesize = 10, index = 0).
        /// </summary>
        public static readonly PagingValues Default = new PagingValues();
    }
}
