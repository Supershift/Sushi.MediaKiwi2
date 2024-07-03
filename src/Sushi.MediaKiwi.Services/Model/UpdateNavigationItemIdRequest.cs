using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Request sent to update the id of a navigation item to a new value.
    /// </summary>
    public record UpdateNavigationItemIdRequest
    {
        /// <summary>
        /// The id of the navigation item to update.
        /// </summary>
        public required string FromId { get; init; }
        /// <summary>
        /// The id to update the navigation item to.
        /// </summary>
        public required string ToId { get; init; }
    }
}
