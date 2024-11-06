using Sushi.MicroORM.Supporting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Defines which fields from <typeparamref name="T"/> can be used for sorting using expressions.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class SortMap<T> : ISortMap
    {
        private readonly Dictionary<string, Expression<Func<T, object?>>> _items = new Dictionary<string, Expression<Func<T, object?>>>(StringComparer.InvariantCultureIgnoreCase);

        /// <summary>
        /// Creates a new instance of <see cref="SortMap{T}"/>.
        /// </summary>
        public SortMap()
        {

        }

        /// <summary>
        /// Adds a field to sort on to the map.
        /// </summary>
        /// <param name="expression"></param>
        public void Add(Expression<Func<T, object?>> expression)
        {
            var _memberTree = ReflectionHelper.GetMemberTree(expression);
            var id = FirstCharToLower(string.Join(".", _memberTree.Select(x => x.Name)));
            _items.Add(id, expression);

            static string FirstCharToLower(string n) => char.ToLowerInvariant(n[0]) + n[1..];
        }

        /// <summary>
        /// Gets the sort <see cref="Expression"/> for the given key.
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public Expression<Func<T, object?>>? GetItem(string key)
        {
            if (_items.ContainsKey(key)) return _items[key];
            return null;
        }
        
        
        Expression? ISortMap.GetItem(string key)
        {
            return GetItem(key);
        }

        /// <inheritdoc/>
        public IEnumerable<string> GetSortFields()
        {
            return _items.Keys;
        }

        /// <inheritdoc/>
        public void Add(Expression expression)
        {
            var candidate = expression as Expression<Func<T, object?>>;
            if (candidate == null)
                throw new ArgumentException($"Can only add Expressions of type Func<{typeof(T)} ,object>");

            Add(candidate);
        }
    }
}
