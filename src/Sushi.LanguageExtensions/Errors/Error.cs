using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// 
    /// </summary>    
    [JsonDerivedType(typeof(AggregateError))]
    [JsonDerivedType(typeof(ValidationError))]
    [JsonPolymorphic(UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FallBackToNearestAncestor)]
    public record Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public Error(string message) : this(message, null, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public Error(string message, Exception exception) : this(message, null, exception) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>        
        public Error(string message, string? errorCode, Exception? exception)
        {
            Message = message;
            Exception = exception;
            ErrorType = GetType().Name;            
            ErrorCode = errorCode;            
        }

        /// <summary>
        /// First level of error indication, e.g. ValidationError, AggregateError, etc.
        /// </summary>                
        public string ErrorType { get; init; }

        /// <summary>
        /// Optionally defines a second level of error indication, e.g. MaximumLengthValidator for ValdationErrors, etc.
        /// </summary>
        public string? ErrorCode { get; init; }

        /// <summary>
        /// A human-readable message describing the error. 
        /// </summary>                
        public string Message { get; init; }

        /// <summary>
        /// If not null, gets the <see cref="System.Exception"/> which caused the error.
        /// </summary>        
        [JsonIgnore, IgnoreDataMember]
        public Exception? Exception { get; }

        

        
    }
}
