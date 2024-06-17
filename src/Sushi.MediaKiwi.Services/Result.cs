using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Defines the possible result codes for a service operation.
    /// </summary>
    public enum ResultCode
    {
        /// <summary>
        /// Success
        /// </summary>
        Success,
        /// <summary>
        /// Validation failed
        /// </summary>
        ValidationFailed,
        /// <summary>
        /// Not found
        /// </summary>
        NotFound,
        /// <summary>
        /// Not allowed
        /// </summary>
        NotAllowed,    
        /// <summary>
        /// Failed
        /// </summary>
        Failed,
        /// <summary>
        /// Delete constraint violation
        /// </summary>
        DeleteConstraintViolation
    }

    /// <summary>
    /// Represents the result of a service operation.
    /// </summary>
    public class Result
    {
        /// <summary>
        /// Creates a new instance of <see cref="Result"/>.
        /// </summary>
        /// <param name="code"></param>
        public Result(ResultCode code)
        {
            Code = code;
        }

        /// <summary>
        /// Creates a new instance of <see cref="Result"/>.
        /// </summary>
        /// <param name="validationResult"></param>
        public Result(ValidationResult validationResult) : this(ResultCode.ValidationFailed)
        {
            ValidationResult = validationResult;
        }

        /// <summary>
        /// Gets the result code.
        /// </summary>
        public ResultCode Code { get; }
        /// <summary>
        /// Human readable description of the result code.
        /// </summary>
        public string CodeDescription { get { return Code.ToString(); } }        
        /// <summary>
        /// If the result is failed validation, this property contains the validation result.
        /// </summary>
        public ValidationResult? ValidationResult { get; }
        /// <summary>
        /// Human readable error message.
        /// </summary>
        public string? ErrorMessage { get; set; }
    }

    /// <summary>
    /// Represents the result of a service operation with a value.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Result<T> : Result where T : class
    {
        /// <summary>
        /// Creates a new instance of <see cref="Result{T}"/>.
        /// </summary>
        /// <param name="code"></param>
        public Result(ResultCode code) : base(code)
        {

        }

        /// <summary>
        /// Creates a new instance of <see cref="Result{T}"/>.
        /// </summary>
        public Result(ValidationResult validationResult) : base(validationResult)
        {

        }

        /// <summary>
        /// Creates a new instance of <see cref="Result{T}"/>.
        /// </summary>
        public Result(T value) : this(ResultCode.Success, value)
        {

        }

        /// <summary>
        /// Creates a new instance of <see cref="Result{T}"/>.
        /// </summary>
        public Result(ResultCode code, T value) : this(code)
        {
            Value = value;
        }

        /// <summary>
        /// If success, contains the value of the result.
        /// </summary>
        public T? Value { get; }
    }

    /// <summary>
    /// The result of a validation check.
    /// </summary>
    public class ValidationResult
    {
        /// <summary>
        /// If set to true, the validation was successful.
        /// </summary>
        public bool IsValid { get; set; }
        /// <summary>
        /// Collection of validation errors.
        /// </summary>
        public Dictionary<string, string> Errors { get; } = new Dictionary<string, string>();
    }
}
