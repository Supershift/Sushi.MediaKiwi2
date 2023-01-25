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
        public static IServiceCollection AddMediaKiwiServices(this IServiceCollection services, string defaultConnectionString, Action<MicroOrmConfigurationBuilder>? config = null)
        {
            // add DAL (which includes MicroORM)
            services.AddMediaKiwiDAL(defaultConnectionString, config);

            // add automapper
            services.AddAutoMapper(c => c.AddProfile<AutoMapperProfile>());

            // add services
            services.TryAddTransient<SectionService>();

            return services;
        }
    }
}
