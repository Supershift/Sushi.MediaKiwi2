using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{
    /// <summary>
    /// Binds to context to extract a <see cref="SortQuery{TMap, TType}"/>.
    /// </summary>
    public class SortingBinder<TMap, TType> : IModelBinder where TMap : ISortMap, new()
    {
        /// <summary>
        /// Binds
        /// </summary>
        /// <param name="bindingContext"></param>
        /// <returns>A sort query</returns>
        /// <exception cref="ArgumentNullException"></exception>
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            ArgumentNullException.ThrowIfNull(nameof(bindingContext));

            string? sortExpression = bindingContext.ValueProvider.GetValue("sortBy").FirstValue;
            string? sortDirection = bindingContext.ValueProvider.GetValue("sortDirection").FirstValue;

            var model = new SortQuery<TMap, TType>(sortExpression, sortDirection);

            bindingContext.Result = ModelBindingResult.Success(model);
            return Task.CompletedTask;
        }
    }
}
