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
    public record StringTooLongError : Error
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="field"></param>
        /// <param name="maxCharacters"></param>
        /// <param name="actualCharacters"></param>
        public StringTooLongError(string field, int maxCharacters, int actualCharacters) : 
            base($"{actualCharacters} characters exceeds max allowed length of {maxCharacters}.", field)
        {
            this.Parameters.Add("maxCharacters", maxCharacters);        
        }
        
    }
}
