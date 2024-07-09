using System.Collections;
using System.Collections.ObjectModel;
using System.Runtime.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// Represents one or more errors that occured during execution.
    /// </summary>        
    public record AggregateError<T> : Error, IReadOnlyList<T> where T : Error
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
            : base(message, null, exception)
        {
            _errors = errors.ToList();            
        }

        private List<T> _errors;

        /// <summary>
        /// Gets the collection of errors that caused this error.
        /// </summary>           
        public IReadOnlyList<T> Errors => _errors;

        /// <inheritdoc/>        
        public int Count => ((IReadOnlyCollection<T>)_errors).Count;

        /// <inheritdoc/>
        public T this[int index] => ((IReadOnlyList<T>)_errors)[index];

        /// <summary>
        /// Adds an error to the aggregate.
        /// </summary>
        /// <param name="error"></param>
        public void Add(T error)
        {
            _errors.Add(error);
        }

        /// <inheritdoc/>
        public IEnumerator<T> GetEnumerator()
        {
            return ((IEnumerable<T>)_errors).GetEnumerator();
        }

        /// <inheritdoc/>
        IEnumerator IEnumerable.GetEnumerator()
        {
            return ((IEnumerable)_errors).GetEnumerator();
        }
    }

    /// <summary>
    /// 
    /// </summary>
    public record AggregateError : AggregateError<Error>
    {
        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(params Error[] errors) : base(errors) { }


        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<Error> errors) : base(errors) { }            

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<Error> errors, string message) : base(errors, message) { }            

        /// <summary>
        /// Creates a new instance of <see cref="AggregateError"/>.
        /// </summary>
        public AggregateError(IEnumerable<Error> errors, string message, Exception? exception) : base(errors, message, exception) { }            
    }
}
