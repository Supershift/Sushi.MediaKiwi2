using System.Collections;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// 
    /// </summary>
    public record AggregateError : Error, IReadOnlyList<Error>
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
            : base(message, null, exception)
        {
            _errors = errors.ToList();
        }

        private List<Error> _errors;

        /// <summary>
        /// Gets the collection of errors that caused this error.
        /// </summary>           
        public IReadOnlyList<Error> Errors => _errors;

        /// <inheritdoc/>        
        public int Count => _errors.Count;

        /// <inheritdoc/>
        public Error this[int index] => _errors[index];

        /// <summary>
        /// Adds an error to the aggregate.
        /// </summary>
        /// <param name="error"></param>
        public void Add(Error error)
        {
            _errors.Add(error);
        }

        /// <inheritdoc/>
        public IEnumerator<Error> GetEnumerator()
        {
            return _errors.GetEnumerator();
        }

        /// <inheritdoc/>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return _errors.GetEnumerator();
        }
    }

    /// <summary>
    /// Represents one or more errors that occured during execution.
    /// </summary>        
    public record AggregateError<T> : AggregateError, IReadOnlyList<T> where T : Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(params T[] errors)
            : this(errors, "One or more errors occured") { }

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<T> errors)
            : this(errors, "One or more errors occured") { }

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<T> errors, string message)
            : this(errors, message, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<T> errors, string message, Exception? exception)
            : base(errors.Cast<Error>(), message, exception)
        {
            
        }

        /// <inheritdoc/>
        public override string ErrorType => GetType().BaseType!.Name;

        /// <summary>
        /// Gets the collection of errors that caused this error.
        /// </summary>           
        public new IReadOnlyList<T> Errors => base.Errors.Cast<T>().ToList();

        /// <inheritdoc/>
        public new T this[int index] => (T)base[index];

        /// <summary>
        /// Adds an error to the aggregate.
        /// </summary>
        /// <param name="error"></param>
        public void Add(T error)
        {
            base.Add(error);
        }

        /// <inheritdoc/>
        public new IEnumerator<T> GetEnumerator()
        {
            return Errors.GetEnumerator();
        }

        /// <inheritdoc/>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return Errors.GetEnumerator();
        }
    }
}
