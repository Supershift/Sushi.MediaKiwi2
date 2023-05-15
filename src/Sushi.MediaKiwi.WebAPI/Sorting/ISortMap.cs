using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Defines which fields in a model can be used for sorting using expressions.
    /// </summary>
    public interface ISortMap
    {
        /// <summary>
        /// Gets the fields which can be used for sorting.
        /// </summary>
        /// <returns></returns>
        IEnumerable<string> GetSortFields();

        /// <summary>
        /// Adds a field to sort on to the map.
        /// </summary>
        /// <param name="expression"></param>
        void Add(Expression expression);

        /// <summary>
        /// Gets the sort <see cref="Expression"/> for the given key.
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        Expression? GetItem(string key);
    }
}
