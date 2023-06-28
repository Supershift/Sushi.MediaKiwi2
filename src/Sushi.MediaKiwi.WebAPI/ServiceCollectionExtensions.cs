using AutoMapper;
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
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwiApi(this IServiceCollection collection, string defaultConnectionString, 
            Action<MicroOrmConfigurationBuilder>? microOrmConfig = null, 
            Action<IMapperConfigurationExpression>? autoMapperConfig = null)
        {
            // add mk services
            collection.AddMediaKiwiServices(defaultConnectionString, 
                microOrmConfig: microOrmConfig, 
                autoMapperConfig: autoMapperConfig);

            // add context accessor
            collection.AddHttpContextAccessor();
            
            // add mk dependencies
            collection.TryAddTransient<Paging.PagingRetriever>();
            collection.TryAddTransient<Sorting.SortingRetriever>();

            return collection;
        }
    }
}
