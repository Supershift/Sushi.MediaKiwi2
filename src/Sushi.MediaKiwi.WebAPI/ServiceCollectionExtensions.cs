using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.WebAPI.Paging;
using Sushi.MediaKiwi.WebAPI.Sorting;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Reflection;

namespace Sushi.MediaKiwi.WebAPI
{
    /// <summary>
    /// Provides extension methods for <see cref="IServiceCollection"/>.
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adds all services needed to run MediaKiwi to the <paramref name="services"/>, including Sushi.MicroOrm.
        /// </summary>        
        /// <returns></returns>
        public static IServiceCollection AddMediaKiwiApi(
            this IServiceCollection services, 
            IConfigurationSection? azureAdConfig,
            Action<IMapperConfigurationExpression>? autoMapperConfig = null,
            Action<AuthorizationOptions>? authorizationOptions = null)
        {
            // add mk services
            services.AddMediaKiwiServices(autoMapperConfig: autoMapperConfig);

            // add context accessor
            services.AddHttpContextAccessor();

            // add mk dependencies
            services.TryAddTransient<Sorting.SortingRetriever>();

            // Use custom authorization options
            services.AddAuthorization(options =>
            {
                authorizationOptions?.Invoke(options);
                options.AddPolicy(Constants.AdminPolicyName, policy => policy.RequireRole(Constants.AdminRoleName));
            });

            // add authentication
            var authenticationBuilder = services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);
            if (azureAdConfig != null)
                authenticationBuilder.AddMicrosoftIdentityWebApi(azureAdConfig);

            return services;
        }

        /// <summary>
        /// Adds MediaKiwi to the <paramref name="options"/>.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public static SwaggerGenOptions AddMediaKiwiSwagger(this SwaggerGenOptions options)
        {
            // add documentation
            var apiFilename = $"{Assembly.GetAssembly(typeof(SectionController))?.GetName().Name}.xml";
            if (File.Exists(apiFilename))
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, apiFilename));

            var webModelFilename = $"{Assembly.GetAssembly(typeof(SectionService))?.GetName().Name}.xml";
            if (File.Exists(webModelFilename))
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, webModelFilename));

            // add paging parameters
            options.OperationFilter<PagingSwaggerFilter>();
            options.OperationFilter<ContinuationSwaggerFilter>();

            // add sorting parameters
            options.OperationFilter<SortingSwaggerFilter>();

            // add docs for mediakiw
            options.SwaggerDoc("MediaKiwi", new OpenApiInfo { Title = "MediaKiwi" });
            options.EnableAnnotations();

            // add JWT bearer
            // add bearer token
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer"
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header
                    },
                    new List<string>()
                }
            });

            return options;
        }

        /// <summary>
        /// Adds MediaKiwi to Swagger.
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public static SwaggerUIOptions AddMediaKiwiSwaggerUI(this SwaggerUIOptions options)
        {
            options.SwaggerEndpoint("../swagger/MediaKiwi/swagger.json", "MediaKiwi");
            return options;
        }
    }
}
