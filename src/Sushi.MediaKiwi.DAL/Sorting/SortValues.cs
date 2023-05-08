using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.Sorting
{
    /// <summary>
    /// Represents a sort field and direction.
    /// </summary>
    public class SortValues
    {
        /// <summary>
        /// Creates a new instance of <see cref="SortValues"/>.
        /// </summary>
        /// <param name="sortField"></param>
        /// <param name="direction"></param>
        public SortValues(Expression sortField, SortDirection direction)
        {
            SortField = sortField;
            Direction = direction;
        }
        
        /// <summary>
        /// Gets the field to sort by.
        /// </summary>
        public Expression SortField { get; }
        
        /// <summary>
        /// Gets the direction to sort by.
        /// </summary>
        public SortDirection Direction { get; }
    }

    /// <summary>
    /// Represents a strongly typed sort field and direction.
    /// </summary>
    public class SortValues<T> : SortValues
    {
        /// <summary>
        /// Creates a new instance of <see cref="SortValues{T}"/>.
        /// </summary>
        /// <param name="sortField"></param>
        /// <param name="direction"></param>
        public SortValues(Expression<Func<T, object>> sortField, SortDirection direction) : base(sortField, direction)
        {
            
        }

        /// <summary>
        /// Gets the field to sort by.
        /// </summary>
        public new Expression<Func<T, object>> SortField => (Expression<Func<T, object>>)base.SortField;
    }
}
