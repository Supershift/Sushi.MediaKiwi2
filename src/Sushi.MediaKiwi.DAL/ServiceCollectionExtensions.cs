using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL
{
    /// <summary>
    /// Extends <see cref="IServiceCollection"/> with methods to add MediaKiwi DAL.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds dependencies for MediaKiwi DAL to the service collection.
        /// </summary>
        /// <param name="services"></param>        
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwiDAL(this IServiceCollection services)
        {
            services.TryAddTransient<ISectionRepository, SectionRepository>();
            services.TryAddTransient<IViewRepository, ViewRepository>();
            services.TryAddTransient<INavigationItemRepository, NavigationItemRepository>();
            services.TryAddTransient<IViewRoleRepository, ViewRoleRepository>();
            services.TryAddTransient<IRoleRepository, RoleRepository>();
            services.TryAddTransient<ILocaleRepository, LocaleRepository>();
            services.TryAddTransient<ITranslationRepository, TranslationRepository>();

            return services;
        }
    }
}
