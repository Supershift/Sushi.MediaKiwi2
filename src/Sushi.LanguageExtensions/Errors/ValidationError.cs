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
        public ValidationError(string message) : this(message, null, null, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="ValidationError"/>.
        /// </summary>
        public ValidationError(string message, string? field, string? errorCode) : this(message, field, errorCode, null)
        {
            
        }

        /// <summary>
        /// Creates a new instance of <see cref="ValidationError"/>.
        /// </summary>        
        public ValidationError(string message, string? field, string? errorCode, Dictionary<string, object>? parameters) : base(message, field, errorCode, null, parameters)
        {
            
        }
    }
}
