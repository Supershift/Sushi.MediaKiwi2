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
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddMediaKiwiDAL(this IServiceCollection services, string defaultConnectionString, Action<MicroOrmConfigurationBuilder>? config = null)
        {
            services.AddMicroORM(defaultConnectionString, config);

            services.TryAddTransient<ISectionRepository, SectionRepository>();
            services.TryAddTransient<IViewRepository, ViewRepository>();
            services.TryAddTransient<INavigationItemRepository, NavigationItemRepository>();
            services.TryAddTransient<IViewRoleRepository, ViewRoleRepository>();
            services.TryAddTransient<IRoleRepository, RoleRepository>();
            services.TryAddTransient<ILocaleRepository, LocaleRepository>();

            return services;
        }
    }
}
