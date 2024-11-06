using FluentValidation.Results;
using Sushi.LanguageExtensions.Errors;

namespace Sushi.MediaKiwi.SampleAPI
{
    public static class ValidationResultExtensions
    {
        /// <summary>
        /// Creates an <see cref="Error"/> from a <see cref="ValidationResult"/>.
        /// </summary>
        /// <param name="validationResult"></param>
        /// <returns></returns>
        public static Error ToError(this ValidationResult validationResult)
        {
            var errors = new List<ValidationError>();
            foreach (var error in validationResult.Errors)
            {
                var validationError = new ValidationError(error.ErrorMessage, error.PropertyName, error.ErrorCode);
                errors.Add(validationError);
            }

            return new AggregateError(errors);
        }
    }
}
