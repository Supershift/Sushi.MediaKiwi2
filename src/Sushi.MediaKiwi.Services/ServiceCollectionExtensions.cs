using AutoMapper;
using AutoMapper.Extensions.ExpressionMapping;
using AutoMapper.Internal;
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
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwiServices(this IServiceCollection collection, string defaultConnectionString, 
            Action<MicroOrmConfigurationBuilder>? microOrmConfig = null,
            Action<IMapperConfigurationExpression>? autoMapperConfig = null)
        {
            // add DAL (which includes MicroORM)
            collection.AddMediaKiwiDAL(defaultConnectionString, microOrmConfig);

            // add automapper
            collection.AddAutoMapper(c => {
                // add client's config if supplied
                if(autoMapperConfig != null)
                    autoMapperConfig(c);
                
                // add our own config
                c.AddProfile<AutoMapperProfile>();
                c.AddExpressionMapping();                
            });

            // add services
            collection.TryAddTransient<SectionService>();
            collection.TryAddTransient<ViewService>();
            collection.TryAddTransient<NavigationItemService>();
            collection.TryAddTransient<RoleService>();
            collection.TryAddTransient<LocaleService>();
            collection.TryAddTransient<TranslationService>();

            return collection;
        }
    }
}
