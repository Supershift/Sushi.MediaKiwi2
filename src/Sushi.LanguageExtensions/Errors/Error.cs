using FluentValidation.Results;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Sushi.LanguageExtensions.Errors
{
    /// <summary>
    /// 
    /// </summary>    
    [JsonDerivedType(typeof(AggregateError))]
    [JsonPolymorphic(UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FallBackToNearestAncestor)]
    public record Error
    {
        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public Error(string message) : this(message, null, null, null, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public Error(string message, string field) : this(message, field, null, null, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>
        public Error(string message, Exception exception) : this(message, null, null, exception, null) { }

        /// <summary>
        /// Creates a new instance of <see cref="Error"/>.
        /// </summary>        
        public Error(string message, string? field, string? errorCode, Exception? exception, Dictionary<string, object>? parameters)
        {
            Message = message;
            Exception = exception;
            ErrorType = GetType().Name;
            Field = field;
            ErrorCode = errorCode;
            if (parameters != null)
                Parameters = new Dictionary<string, object>(parameters);
            else
                Parameters = [];
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

        /// <summary>
        /// Contains parameters and values which can be used to format an error message, e.g. { "maxLength", 128 }
        /// </summary>                
        public Dictionary<string, object> Parameters { get; }

        /// <summary>
        /// If this error is related to a specific field, this property contains the name of the field, e.g. "Username", "Title", etc.
        /// </summary>                
        public string? Field { get; init; }

        /// <summary>
        /// Creates an <see cref="Error"/> from a <see cref="ValidationResult"/>.
        /// </summary>
        /// <param name="validationResult"></param>
        /// <returns></returns>
        public static Error FromValidationResult(ValidationResult validationResult)
        {
            var errors = new List<ValidationError>();
            foreach (var error in validationResult.Errors)
            {
                var validationError = new ValidationError(error.ErrorMessage, error.PropertyName, error.ErrorCode, error.FormattedMessagePlaceholderValues);
                errors.Add(validationError);
            }

            return new AggregateError(errors);
        }
    }
}
