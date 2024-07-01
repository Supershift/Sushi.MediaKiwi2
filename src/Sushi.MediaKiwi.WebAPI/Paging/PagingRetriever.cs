using Microsoft.AspNetCore.Http;
using Sushi.MediaKiwi.Services;

namespace Sushi.MediaKiwi.WebAPI.Paging
{
    /// <summary>
    /// Retrieves <see cref="PagingValues"/> from <see cref="HttpContext"/>.
    /// </summary>
    [Obsolete("PagingRetriever is deprecated, paging can be retrieved from the query.")]
    public class PagingRetriever
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Creates a new instance of <see cref="PagingRetriever"/>.
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public PagingRetriever(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Gets <see cref="PagingValues"/> from the current <see cref="HttpContext"/>.
        /// </summary>
        /// <returns></returns>
        [Obsolete("GetPaging is deprecated, paging can be retrieved from the query.")]
        public PagingValues GetPaging()
        {
            var context = _httpContextAccessor.HttpContext;

            PagingValues? result = null;

            // get value from context
            if (context?.Items != null)
            {
                if (context.Items.ContainsKey("paging"))
                {
                    result = context.Items["paging"] as PagingValues;
                }
            }

            // create default if none paging data found
            if(result == null)
            {
                result = PagingValues.Default;
            }

            // return result
            return result;
        }
    }
}
