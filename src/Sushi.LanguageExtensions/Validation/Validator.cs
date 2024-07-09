using Sushi.LanguageExtensions.Errors;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

namespace Sushi.LanguageExtensions.Validation
{   
    /// <summary>
    /// Validates a value agains any of the called validation methods. The validation methods use DataAnnotations' validation mechanism. 
    /// Validation is called in the order in which the methods are called. If validation fails, subsequent validations are not executed.    
    /// </summary>
    public class Validator
    {
        private readonly object? _value;        
        private readonly string _fieldName;
        private readonly Validator? _previousSibling;
        private ValidationContext _validationContext;

        /// <summary>
        /// Creates a new instance of <see cref="Validator"/>.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="subjectUnderTest"></param>
        /// <param name="fieldName"></param>
        public Validator(object? value, object subjectUnderTest, string fieldName)
        {
            _value = value;            
            _fieldName = fieldName;                        
            _validationContext = new ValidationContext(subjectUnderTest)
            {
                MemberName = fieldName
            };
        }

        internal Validator(object? value, object subjectUnderTest, string fieldName, Validator previousSibling) : this(value, subjectUnderTest, fieldName)
        {
            _previousSibling = previousSibling;
        }

        private ValidationError? _error = null;

        /// <summary>
        /// Gets the result of the validations.
        /// </summary>
        public Result<AggregateError<ValidationError>> Result()
        {
            // get the result of the previous sibling
            var result = _previousSibling?.Result().Error;

            // add our error if we have one
            if (_error != null)
            {
                if (result == null)
                    result = new AggregateError<ValidationError>();
                result.Add(_error);
            }

            // determine if we have an error or success
            if (result != null)
                return result;
            else
                return Result<AggregateError<ValidationError>>.Success();
        }
        /// <summary>
        /// Starts a new validator for the provided value. The result of all chained validators are combined. E.g. if multiple validators fail, an <see cref="AggregateError"/> is set as result.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="fieldName"></param>
        /// <returns></returns>
        public Validator Value(object? value, [CallerArgumentExpression(nameof(value))] string fieldName = "field")
        {
            return new Validator(value, _validationContext.ObjectInstance, fieldName, this);
        }

        /// <summary>
        /// Checks if the value exceeds the provided length.
        /// </summary>
        /// <param name="maxLength"></param>
        /// <returns></returns>
        public Validator MaxLength(int maxLength)
        {
            var attribute = new MaxLengthAttribute(maxLength);
            return ValidateAttribute(attribute, "MaxLength");
        }

        /// <summary>
        /// Checks if the value's length is between max and min length.
        /// </summary>
        /// <param name="maxLength"></param>
        /// <param name="minLength"></param>
        /// <returns></returns>
        public Validator StringLength(int maxLength, int minLength = 0)
        {
            var attribute = new StringLengthAttribute(maxLength) { MinimumLength = minLength };
            return ValidateAttribute(attribute, "StringLength");
        }

        /// <summary>
        /// Checks if the value is not null.
        /// </summary>
        /// <returns></returns>
        public Validator Required()
        {
            var attribute = new RequiredAttribute();
            return ValidateAttribute(attribute, "Required");
        }

        /// <summary>
        /// Validates if value matches the provided regex.
        /// </summary>
        /// <param name="regex"></param>
        /// <returns></returns>
        public Validator Regex(Regex regex)
        {
            // get error messag from regex attribute (there might be a more efficient way to do this)
            // do not use the regex attribute for validation, because it builds a new regex object everytime
            var attribute = new RegularExpressionAttribute(regex.ToString());
            string errorMessage = attribute.FormatErrorMessage(_fieldName);

            Func<object?, bool> predicate = (object? value) =>
            {
                // Convert the value to a string
                string? stringValue = Convert.ToString(_value, CultureInfo.CurrentCulture);

                // Automatically pass if value is null or empty. Required should be used to assert a value is not empty.
                if (string.IsNullOrEmpty(stringValue))
                {
                    return true;
                }

                Match m = regex.Match(stringValue);

                // We are looking for an exact match, not just a search hit. This matches what
                // the RegularExpressionValidator control does
                var isValid = (m.Success && m.Index == 0 && m.Length == stringValue.Length);
                return isValid;
            };

            return ValidatePredicate(predicate, "Regex", errorMessage);
        }

        /// <summary>
        /// Validates the value against the provided validation attribute.
        /// </summary>
        /// <param name="attribute"></param>
        /// <param name="errorCode">The error code to use if validation fails</param>
        /// <returns></returns>
        public Validator ValidateAttribute(ValidationAttribute attribute, string errorCode)
        {
            // only perform validation if no error is already found
            if (_error == null)
            {   
                var validationResult = attribute.GetValidationResult(_value, _validationContext);
                if (validationResult != null)
                {
                    _error = new ValidationError(validationResult.ErrorMessage!, _fieldName, errorCode);
                }
            }
            return this;
        }

        /// <summary>
        /// Validates the value against the provided predicate. This does not use DataAnnotations.
        /// </summary>        
        /// <returns></returns>
        public Validator ValidatePredicate(Func<object?, bool> predicate, string errorCode, string? errorMessage = null)
        {
            // only perform validation if no error is already found
            if (_error == null)
            {
                if (predicate(_value) == false)
                {
                    if (string.IsNullOrWhiteSpace(errorMessage))
                        errorMessage = $"Validation failed for {_fieldName}";
                    _error = new ValidationError(errorMessage, _fieldName, errorCode);
                }
            }
            return this;
        }

        /// <summary>
        /// Throws an exception if validation failed.
        /// </summary>
        public void Throw()
        {   
            var result = Result();
            if (result.Error != null)
            {
                throw new ValidationException(result.Error);
            }
        }
    }
}
