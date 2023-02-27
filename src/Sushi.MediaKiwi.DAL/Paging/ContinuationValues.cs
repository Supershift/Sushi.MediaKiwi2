using Azure.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Paging
{
    /// <summary>
    /// Represents values used when adding continuous scroll on datasets.
    /// </summary>
    public record ContinuationValues
    {
        /// <summary>
        /// Gets a <see cref="ContinuationValues"/> instance with default values (maxItems = 10, token = NULL).
        /// </summary>
        public static readonly ContinuationValues Default = new ContinuationValues(null, 10);

        /// <summary>
        /// Creates a new instance of <see cref="ContinuationValues"/>.
        /// </summary>        
        public ContinuationValues(string? token, int pageSize)
        {
            Token = token;
            MaxItems = pageSize;
        }

        /// <summary>
        /// Gets the continuation token.
        /// </summary>
        public string? Token { get; }

        /// <summary>
        /// Gets the maximum number of items returned per call.
        /// </summary>
        public int MaxItems { get; }
    }
}
