using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sushi.MediaKiwi.Services;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Represents values used when sorting datasets.
    /// </summary>
    public class SortingBinder : IModelBinder
    {
        /// <summary>
        /// Binds sortingvalue to <see cref="SortValues"/>.
        /// </summary>
        /// <param name="bindingContext"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                throw new ArgumentNullException(nameof(bindingContext));
            }

            // get default values
            string? sortExpression = bindingContext.ValueProvider.GetValue("sortBy").FirstValue;
            string? sortDirection = bindingContext.ValueProvider.GetValue("sortDirection").FirstValue;

            // Create the model
            var model = new SortingStrings(sortExpression, sortDirection);

            // Set the model as the result of the model binding
            bindingContext.Result = ModelBindingResult.Success(model);


            return Task.CompletedTask;
        }
    }
}
