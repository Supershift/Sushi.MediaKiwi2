using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// An item with the same identifier already exists.
    /// </summary>
    public record AlreadyExistsError : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="AlreadyExistsError"/>.
        /// </summary>
        /// <param name="message"></param>
        public AlreadyExistsError(string? message = null) : base(message ?? "The item already exists.")
        {
                
        }
    }
}
