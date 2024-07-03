using Microsoft.AspNetCore.Mvc;
using Sushi.LanguageExtensions.Errors;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// 
    /// </summary>
    public class ErrorProblemDetails : ProblemDetails
    {   
        /// <summary>
        /// 
        /// </summary>
        public Error? Error { get; set; }
    }

    
}
