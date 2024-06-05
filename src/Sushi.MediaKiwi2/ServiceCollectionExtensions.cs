using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.WebAPI;

namespace Sushi.MediaKiwi2
{
    /// <summary>
    /// Extends <see cref="IServiceCollection"/> with methods to add MediaKiwi.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds services needed to run MediaKiwi to the <paramref name="services"/>. 
        /// MediaKiwi requires MicroOrm, which must be added by the caller.
        /// </summary>        
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwi(this IServiceCollection services, 
            IConfigurationSection? azureAdConfig = null,
            Action<IMapperConfigurationExpression>? autoMapperConfig = null,
            Action<AuthorizationOptions>? authorizationOptions = null)
        {
            services.AddMediaKiwiDAL();
            services.AddMediaKiwiApi(azureAdConfig, autoMapperConfig, authorizationOptions);
            return services;
        }
    }
}
