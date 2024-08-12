using Microsoft.AspNetCore.Mvc.ModelBinding;
using Sushi.MediaKiwi.Services;

namespace Sushi.MediaKiwi.WebAPI.Sorting
{

    /// <summary>
    /// Represents values used when sorting datasets.
    /// </summary>
    public class SortingBinder<TSortMap> : IModelBinder where TSortMap : ISortMap, new()
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public SortingBinder()
        {
            SortMap = new TSortMap();
        }

        /// <inheritdoc/>        
        public ISortMap SortMap { get; }

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
            SortDirection sortDirection = SortDirection.ASC;

            // Try to fetch the value of the argument by name
            var sortByValue = bindingContext.ValueProvider.GetValue("sortBy");

            if (!string.IsNullOrWhiteSpace(sortByValue.FirstValue))
            {
                // get sort expression
                var sortExpression = SortMap.GetItem(sortByValue.FirstValue!)!;

                if (!string.IsNullOrWhiteSpace(sortByValue.FirstValue))
                {
                    if (sortByValue.FirstValue.Equals(SortDirection.DESC.ToString(), StringComparison.OrdinalIgnoreCase))
                    {
                        sortDirection = SortDirection.DESC;
                    }
                }

                // Create the model
                var model = new SortValues(sortExpression, sortDirection);

                // Set the model as the result of the model binding
                bindingContext.Result = ModelBindingResult.Success(model);
            }

            return Task.CompletedTask;
        }
    }
}
