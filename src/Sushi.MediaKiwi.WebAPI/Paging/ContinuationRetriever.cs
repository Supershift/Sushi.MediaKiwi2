using Microsoft.AspNetCore.Http;
using Sushi.MediaKiwi.DAL.Paging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Retrieves <see cref="ContinuationValues"/> from <see cref="HttpContext"/>.
    /// </summary>
    public class ContinuationRetriever
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Creates a new instance of <see cref="ContinuationRetriever"/>.
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public ContinuationRetriever(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Gets <see cref="ContinuationValues"/> from the current <see cref="HttpContext"/>.
        /// </summary>
        /// <returns></returns>
        public ContinuationValues GetContinuationValues()
        {
            var context = _httpContextAccessor.HttpContext;

            ContinuationValues? result = null;

            // get value from context
            if (context?.Items != null)
            {
                if (context.Items.ContainsKey("continuation"))
                {
                    result = context.Items["continuation"] as ContinuationValues;
                }
            }

            // create default if no continuation data found
            if(result == null)
            {
                result = ContinuationValues.Default;
            }

            // return result
            return result;
        }
    }
}
