using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
{
    public enum ResultCode
    {
        Success,
        ValidationFailed,
        NotFound,
        NotAllowed,        
        Failed,
        DeleteConstraintViolation
    }

    public class Result
    {
        public Result(ResultCode code)
        {
            Code = code;
        }

        public Result(ValidationResult validationResult) : this(ResultCode.ValidationFailed)
        {
            ValidationResult = validationResult;
        }

        public ResultCode Code { get; }
        public string CodeDescription { get { return Code.ToString(); } }
        public ValidationResult? ValidationResult { get; }
        public string? ErrorMessage { get; set; }
    }

    public class Result<T> : Result where T : class
    {
        public Result(ResultCode code) : base(code)
        {

        }

        public Result(ValidationResult validationResult) : base(validationResult)
        {

        }

        public Result(T value) : this(ResultCode.Success, value)
        {

        }

        public Result(ResultCode code, T value) : this(code)
        {
            Value = value;
        }

        public T? Value { get; }
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public Dictionary<string, string> Errors { get; } = new Dictionary<string, string>();
    }
}
