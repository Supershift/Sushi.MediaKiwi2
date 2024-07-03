using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL;
using Sushi.MediaKiwi.WebAPI;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi
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

            // add validators
            services.AddValidatorsFromAssemblyContaining<Services.Model.NavigationItem>(includeInternalTypes: true);

            return services;
        }
    }
}
