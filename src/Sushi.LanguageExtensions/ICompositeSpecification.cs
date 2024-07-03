using System.Collections.ObjectModel;
using Sushi.LanguageExtensions.Errors;

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
        /// Gets the specifications that are combined in this composite specification.
        /// </summary>
        ReadOnlyCollection<ISpecification<T, TError>> Specifications { get; }
    }
}
