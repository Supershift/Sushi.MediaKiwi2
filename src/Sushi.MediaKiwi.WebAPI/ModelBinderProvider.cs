using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.OpenApi.Writers;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Sorting;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// 
    /// </summary>
    public class ModelBinderProvider : IModelBinderProvider
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        /// <exception cref="ArgumentNullException"></exception>
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            
            // Get the model type from the context
            Type modelType = context.Metadata.ModelType;
            //if (modelType.IsGenericType && modelType.GetGenericTypeDefinition() == typeof(SortValues<>))
            //{
            //    // Get the generic type argument (e.g., T in SortValues<T>)
            //    Type genericTypeArgument = context.Metadata.ModelType.GetGenericArguments()[0];

            //    // Construct the SortValues<T> type
            //    Type sortValuesType = typeof(SortValues<>).MakeGenericType(genericTypeArgument);

            //    // Construct the SortingBinder<SortValues<T>> type
            //    //Type binderType = typeof(SortingBinder<>).MakeGenericType(sortValuesType);

            //    return new BinderTypeModelBinder(typeof(SortingBinder<>));
            //}
            if (context.Metadata.ModelType == typeof(PagingValues))
            {
                return new BinderTypeModelBinder(typeof(PagingBinder));
            }


            if (context.Metadata.ModelType == typeof(SortValues))
            {
                return new BinderTypeModelBinder(typeof(SortingBinder<>));
            }


            return null!;
        }
    }
}
