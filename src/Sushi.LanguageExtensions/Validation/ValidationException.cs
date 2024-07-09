using Sushi.LanguageExtensions.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Validation
{
    /// <summary>
    /// Exception thrown if validation fails.
    /// </summary>
    public class ValidationException : Exception
    {
        /// <summary>
        /// Creates a new instance of <see cref="ValidationException"/>.
        /// </summary>
        /// <param name="error"></param>
        public ValidationException(AggregateError<ValidationError> error) : base(error.Message)
        {
            Error = error;
        }

        /// <summary>
        /// The validation error that caused this exception.
        /// </summary>
        public AggregateError<ValidationError> Error { get; }
    }
}
