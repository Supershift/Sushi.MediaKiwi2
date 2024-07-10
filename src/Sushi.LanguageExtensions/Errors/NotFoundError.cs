using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// The requested resource is not found.
    /// </summary>
    public record NotFoundError : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="NotFoundError"/>.
        /// </summary>
        public NotFoundError() : base("The requested resource was not found.") { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public NotFoundError(string message) : base(message) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public NotFoundError(string message, Exception exception) : base(message, exception) { }

        
    }
}
