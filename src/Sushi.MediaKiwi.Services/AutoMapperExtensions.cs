using AutoMapper;
using System.Linq.Expressions;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Provides extensions methods for <see cref="AutoMapper"/>.
    /// </summary>
    public static class AutoMapperExtensions
    {
        /// <summary>
        /// Maps the sort expression on the provided sortValues to <typeparamref name="T"/>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="mapper"></param>
        /// <param name="sortValues"></param>
        /// <returns></returns>
        public static SortValues<T>? MapSortValues<T>(this IMapper mapper, SortValues? sortValues)
        {
            if (sortValues == null)
                return null;
            
            var expression = mapper.Map<Expression<Func<T, object?>>>(sortValues.SortField);

            return new SortValues<T>(expression, sortValues.Direction);
        }
    }
}
