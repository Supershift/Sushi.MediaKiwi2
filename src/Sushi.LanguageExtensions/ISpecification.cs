namespace Sushi.LanguageExtensions
{
    /// <summary>
    /// Defines an interface for specifications.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TError"></typeparam>
    public interface ISpecification<T, TError>
        where TError : Error
    {
        /// <summary>
        /// Checks if the provided <paramref name="entity"/> satisfies the defined predicate.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        Result<TError> IsSatisfiedBy(T entity);
    }
}
