using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Represents a result for a service implementing paging.
    /// </summary>
    interface IPagingResult
    {
        /// <summary>
        /// The total number of records.
        /// </summary>
        int? TotalCount { get; }
        /// <summary>
        /// The total number of pages, based on the requested page size.
        /// </summary>
        int? PageCount { get; }
    }
}
