using AutoMapper;
using AutoMapper.Extensions.ExpressionMapping;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds all services needed to run MediaKiwi to the <paramref name="services"/>, including Sushi.MicroOrm.
        /// </summary>        
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwiServices(this IServiceCollection services, Action<IMapperConfigurationExpression>? autoMapperConfig = null)
        {
            // add DAL 
            services.AddMediaKiwiDAL();

            // add automapper
            services.AddAutoMapper(c => {
                // add client's config if supplied
                if(autoMapperConfig != null)
                    autoMapperConfig(c);
                
                // add our own config
                c.AddProfile<AutoMapperProfile>();
                c.AddExpressionMapping();                
            });

            // add services
            services.TryAddTransient<SectionService>();
            services.TryAddTransient<ViewService>();
            services.TryAddTransient<NavigationItemService>();
            services.TryAddTransient<RoleService>();
            services.TryAddTransient<LocaleService>();
            services.TryAddTransient<AdminTranslationService>();
            services.TryAddTransient<TranslationService>();

            return services;
        }

        
             
    }
}
