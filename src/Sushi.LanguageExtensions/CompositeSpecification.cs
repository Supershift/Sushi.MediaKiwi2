using System.Collections.ObjectModel;

namespace Sushi.LanguageExtensions
{
    /// <summary>
    /// Defines an interface for composite specifications
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TError"></typeparam>
    public interface ICompositeSpecification<T, TError> : ISpecification<T, AggregateError>
        where TError : Error
    {
        /// <summary>
        /// Specifications that are combined in this composite specification.
        /// </summary>
        ReadOnlyCollection<ISpecification<T, TError>> Specifications { get; }
    }

    /// <summary>
    /// Represents a composite specifications, i.e. a specification which combines multiple other specifications.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TError"></typeparam>
    public class CompositeSpecification<T, TError> : ICompositeSpecification<T, TError>
        where TError : Error
    {
        private readonly List<ISpecification<T, TError>> _specifications;

        /// <summary>
        /// Creates a new instance of <see cref="CompositeSpecification{T, TError}"/>.
        /// </summary>
        /// <param name="specifications"></param>
        public CompositeSpecification(IEnumerable<ISpecification<T, TError>> specifications)
        {
            _specifications = specifications.ToList();
        }

        /// <summary>
        /// Specifications that are combined in this composite specification.
        /// </summary>
        public ReadOnlyCollection<ISpecification<T, TError>> Specifications => _specifications.AsReadOnly();

        /// <summary>
        /// Checks if all specifications are satisfied by the given entity.
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        public Result<AggregateError> IsSatisfiedBy(T entity)
        {
            var errors = new List<TError>();
            for (int i = 0; i < _specifications.Count; i++)
            {
                var specification = _specifications[i];
                var result = specification.IsSatisfiedBy(entity);
                if (result.Error != null)
                {
                    errors.Add(result.Error);
                }
            }
            if (errors.Count != 0)
            {
                return new AggregateError(errors);
            }
            return Result<AggregateError>.Success();
        }
    }
}
