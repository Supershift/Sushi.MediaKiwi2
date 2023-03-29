using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services
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
        public static IServiceCollection AddMediaKiwiServices(this IServiceCollection collection, string defaultConnectionString, Action<MicroOrmConfigurationBuilder>? config = null)
        {
            // add DAL (which includes MicroORM)
            collection.AddMediaKiwiDAL(defaultConnectionString, config);

            // add automapper
            collection.AddAutoMapper(c => c.AddProfile<AutoMapperProfile>());

            // add services
            collection.TryAddTransient<SectionService>();
            collection.TryAddTransient<ViewService>();
            collection.TryAddTransient<NavigationItemService>();

            return collection;
        }
    }
}
