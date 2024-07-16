using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Validation
{
    /// <summary>
    /// Defines error codes used in validation errors.
    /// </summary>
    public static class ValidationErrorCode
    {
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member. Justification: names are self-explanatory
        public const string Required = "Required";
        public const string MaxLength = "MaxLength";
        public const string StringLength = "StringLength";
        public const string Regex = "Regex";
        public const string ExactLength = "ExactLength";
        public const string Range = "Range";
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member

    }
}
