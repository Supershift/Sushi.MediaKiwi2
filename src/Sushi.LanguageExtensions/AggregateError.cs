using System.Collections.ObjectModel;

namespace Sushi.LanguageExtensions
{
    /// <summary>
    /// Represents one or more errors that occured during execution.
    /// </summary>
    public record AggregateError : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(params Error[] errors)
            : this(errors, "One or more errors occured") { }

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<Error> errors)
            : this(errors, "One or more errors occured") { }

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<Error> errors, string message)
            : this(errors, message, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<Error> errors, string message, Exception? exception)
            : base(message, exception)
        {
            Errors = errors.ToArray().AsReadOnly();
        }

        /// <summary>
        /// Gets the collection of errors that caused this error.
        /// </summary>
        public ReadOnlyCollection<Error> Errors { get; }
    }
}
