using Sushi.MicroORM;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
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
        /// <param name="result"></param>
        public ListResult(QueryListResult<T> result) : this(result, result) { }

        /// <summary>
        /// Creates a new instance of <see cref="ListResult{T}"/>.
        /// </summary>        
        public ListResult(IList<T> result, MicroORM.IPagingResult paging) : this(result, paging.TotalNumberOfRows, paging.TotalNumberOfPages) { }

        /// <summary>
        /// Creates a new instance of <see cref="ListResult{T}"/>.
        /// </summary>                
        public ListResult(IList<T> result, int? totalCount, int? pageCount) : this((IReadOnlyList<T>)result.AsReadOnly(), totalCount, pageCount) { }

        /// <summary>
        /// Creates a new instance of <see cref="ListResult{T}"/>.
        /// </summary>        
        [JsonConstructor]
        private ListResult(IReadOnlyList<T> result, int? totalCount, int? pageCount)
        {
            Result = result;
            TotalCount = totalCount;
            PageCount = pageCount;
        }

        /// <summary>
        /// The list of items.
        /// </summary>
        [SwaggerSchema(Nullable = false, ReadOnly = true), Required]
        public IReadOnlyList<T> Result { get; private set; }

        /// <inheritdoc/>        
        [SwaggerSchema(ReadOnly = true), Required]
        public int? TotalCount { get; private set; }

        /// <inheritdoc/>
        [SwaggerSchema(ReadOnly = true), Required]
        public int? PageCount { get; private set; }

        /// <summary>
        /// Creates an empty instance of <see cref="ListResult{T}"/> with paging set to 0 items and page count.
        /// </summary>
        /// <returns></returns>
        public static ListResult<T> Empty()
        {
            return new ListResult<T>((IReadOnlyList<T>)new List<T>(), 0, 0);
        }
    }
}
