using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Sushi.MediaKiwi.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Retrieves <see cref="SortValues"/> from <see cref="HttpContext"/>.
    /// </summary>
    public class SortingRetriever
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Creates a new instance of <see cref="SortingRetriever"/>.
        /// </summary>
        /// <param name="httpContextAccessor"></param>
        public SortingRetriever(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Gets <see cref="SortValues"/> from the current <see cref="HttpContext"/>.
        /// </summary>
        /// <returns></returns>
        public SortValues? GetSorting()
        {
            var context = _httpContextAccessor.HttpContext;

            SortValues? result = null;

            // get value from context
            if (context?.Items != null)
            {
                if (context.Items.ContainsKey("sorting"))
                {
                    result = context.Items["sorting"] as SortValues;
                }
            }

            // return result
            return result;
        }

        /// <summary>
        /// Gets <see cref="SortValues{T}"/> from the current <see cref="HttpContext"/>.
        /// </summary>
        /// <returns>SortValues as set on context, or default if none found.</returns>
        public SortValues<T> GetSorting<T>(Expression<Func<T, object?>> defaultSortField, SortDirection defaultDirection)
        {
            var result = GetSorting<T>();

            if (result == null)
                result = new SortValues<T>(defaultSortField, defaultDirection);

            return result;
        }

        /// <summary>
        /// Gets <see cref="SortValues{T}"/> from the current <see cref="HttpContext"/>.
        /// </summary>
        /// <returns></returns>
        public SortValues<T>? GetSorting<T>()
        {
            // get sort value
            var candidate = GetSorting();

            if(candidate == null) 
            { 
                return null; 
            }

            // try to convert to generic instance
            if(candidate.SortField is Expression<Func<T, object?>> sortField)
            {
                return new SortValues<T>(sortField, candidate.Direction);
            }
            else
            {
                throw new InvalidCastException($"Sort values are set, but sort expression is not of type {typeof(T)}.");
            }
        }
    }
}
