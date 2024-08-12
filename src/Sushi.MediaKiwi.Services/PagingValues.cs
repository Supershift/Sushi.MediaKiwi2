using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Represents values used when paging datasets.
    /// </summary>
    public record PagingValues
    {
        /// <summary>
        /// Gets a <see cref="PagingValues"/> instance with default values (pagesize = 10, index = 0).
        /// </summary>
        public static readonly PagingValues Default = new PagingValues(0, 10);

        /// <summary>
        /// Creates a new instance of <see cref="PagingValues"/>.
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        public PagingValues(int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
        }

        /// <summary>
        /// Gets the request zero based index.
        /// </summary>
        public int PageIndex { get; }

        /// <summary>
        /// Gets the number of items per page.
        /// </summary>
        public int PageSize { get; }
    }

    /// <summary>
    /// Model binder for <see cref="PagingValues"/>.
    /// </summary>
    public class PagingBinder : IModelBinder
    {
        /// <summary>
        /// Binds pageIndex and pageSize to <see cref="PagingValues"/>.
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
            int pageIndex = 0;
            int pageSize = PagingValues.Default.PageSize;

            // Try to fetch the value of the argument by name
            var pageIndexValue = bindingContext.ValueProvider.GetValue("pageIndex");
            var pageSizeValue = bindingContext.ValueProvider.GetValue("pageSize");

            if (!string.IsNullOrWhiteSpace(pageIndexValue.FirstValue))
            {
                int.TryParse(pageIndexValue.FirstValue, out pageIndex);
            }

            if (!string.IsNullOrWhiteSpace(pageSizeValue.FirstValue))
            {
                int.TryParse(pageSizeValue.FirstValue, out pageSize);
            }

            // Create the model
            var model = new PagingValues(pageIndex, pageSize);

            // Set the model as the result of the model binding
            bindingContext.Result = ModelBindingResult.Success(model);
            return Task.CompletedTask;
        }
    }
}
