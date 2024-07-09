using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// 
    /// </summary>
    public record ValidationError : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="ValidationError"/>.
        /// </summary>
        public ValidationError(string message) : this(message, null, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="ValidationError"/>.
        /// </summary>
        public ValidationError(string message, string? field, string? errorCode) : base(message, errorCode, null)
        {
            Field = field;
        }

        /// <summary>
        /// If this error is related to a specific field, this property contains the name of the field, e.g. "Username", "Title", etc.
        /// </summary>                
        public string? Field { get; init; }
    }
}
