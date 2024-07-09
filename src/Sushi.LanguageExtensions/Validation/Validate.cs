using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Validation
{
    /// <summary>
    /// Defines a starting point for validation.
    /// </summary>
    public static class Validate
    {   
        /// <summary>
        /// Start validation for the provided value.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public static Validator Value(object? value, [CallerArgumentExpression(nameof(value))] string fieldName = "field")
        {
            return new Validator(value, new object(), fieldName);
        }
    }
}
