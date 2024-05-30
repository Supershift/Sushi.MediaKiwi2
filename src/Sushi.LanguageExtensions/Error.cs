namespace Sushi.LanguageExtensions
{
    /// <summary>
    /// Represents an error.
    /// </summary>
    public record Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public Error(string message)
            : this(message, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        /// <param name="message"></param>
        /// <param name="exception"></param>
        public Error(string message, Exception? exception)
        {
            Message = message;
            Exception = exception;
        }

        /// <summary>
        /// Gets a message describing the error
        /// </summary>
        public string Message { get; }

        /// <summary>
        /// Gets the <see cref="System.Exception"/> which caused the error.
        /// </summary>
        public Exception? Exception { get; }
    }

    /// <summary>
    /// Represents an error.
    /// </summary>
    /// <typeparam name="TErrorCode"></typeparam>
    public record Error<TErrorCode> : Error
        where TErrorCode : Enum
    {
        /// <summary>
        /// Creates a new instance of <see cref="Error{TErrorCode}"/>.
        /// </summary>
        public Error(TErrorCode errorCode)
            : this(errorCode, errorCode.ToString()) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error{TErrorCode}"/>.
        /// </summary>
        public Error(TErrorCode errorCode, string message)
            : this(errorCode, message, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error{TErrorCode}"/>.
        /// </summary>
        public Error(TErrorCode errorCode, string message, Exception? exception)
            : base(message, exception)
        {
            ErrorCode = errorCode;
        }

        /// <summary>
        /// Gets a code describing the kind of error.
        /// </summary>
        public TErrorCode ErrorCode { get; }
    }
}
