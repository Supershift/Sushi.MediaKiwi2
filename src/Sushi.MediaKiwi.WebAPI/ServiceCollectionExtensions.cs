using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds all services needed to run MediaKiwi to the <paramref name="collection"/>, including Sushi.MicroOrm.
        /// </summary>
        /// <param name="collection"></param>
        /// <param name="defaultConnectionString"></param>
        /// <param name="config"></param>
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwiApi(this IServiceCollection collection, string defaultConnectionString, Action<MicroOrmConfigurationBuilder>? config = null)
        {
            // add mk services
            collection.AddMediaKiwiServices(defaultConnectionString, config);

            // add context accessor
            collection.AddHttpContextAccessor();
            
            // add mk dependencies
            collection.AddTransient<Paging.PagingRetriever>();

            return collection;
        }
    }
}
