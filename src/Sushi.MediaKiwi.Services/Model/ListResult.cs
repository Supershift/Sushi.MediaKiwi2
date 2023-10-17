using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.Model
{
    /// <summary>
    /// Represents a result to an API call with a list of items and paging.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ListResult<T> : IPagingResult
    {   
        /// <summary>
        /// Creates a new instance of <see cref="ListResult{T}"/>.
        /// </summary>        
        public ListResult(IList<T> result) : this(result, null, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="ListResult{T}"/>.
        /// </summary>        
        public ListResult(IList<T> result, MicroORM.IPagingResult paging) : this(result, paging.TotalNumberOfRows, paging.TotalNumberOfPages) { }        

        /// <summary>
        /// Creates a new instance of <see cref="ListResult{T}"/>.
        /// </summary>        
        public ListResult(IList<T> result, int? totalCount, int? pageCount)
        {
            Result = result.AsReadOnly();
            TotalCount = totalCount;
            PageCount = pageCount;
        }
        
        /// <summary>
        /// The list of items.
        /// </summary>
        public ReadOnlyCollection<T> Result { get; private set; }
        
        /// <inheritdoc/>        
        public int? TotalCount { get; private set; }

        /// <inheritdoc/>
        public int? PageCount { get; private set; }
    }
}
