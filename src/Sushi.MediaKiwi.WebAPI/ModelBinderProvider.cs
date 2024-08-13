using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.OpenApi.Writers;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MediaKiwi.WebAPI.Sorting;
using System.Diagnostics;

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

            Trace.WriteLine($"t:{modelType}");
            if (modelType.IsGenericType && modelType.GetGenericTypeDefinition() == typeof(SortQuery<,>))
            {
                Type genericTypeArgument = context.Metadata.ModelType.GetGenericArguments()[0];
                Type genericTypeArgument2 = context.Metadata.ModelType.GetGenericArguments()[1];

                Type? genericTypeArgumentsub = genericTypeArgument.BaseType?.GetGenericArguments()[0];
                Trace.WriteLine($"t:{genericTypeArgumentsub}");

                Type binderType = typeof(SortingBinder<,>).MakeGenericType(genericTypeArgument, genericTypeArgument2);

                return new BinderTypeModelBinder(binderType);
            }

            if (context.Metadata.ModelType == typeof(PagingValues))
            {
                return new BinderTypeModelBinder(typeof(PagingBinder));
            }

            return null!;
        }
    }
}
