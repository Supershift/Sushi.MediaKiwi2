using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.User;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class ConfigFixture
    {   
        public ConfigFixture()
        {
            // get config values
            var configuration = new ConfigurationBuilder()
            .AddUserSecrets(Assembly.GetExecutingAssembly(), optional: true)
            .AddEnvironmentVariables()
            .Build();

            string connectionString = configuration.GetConnectionString("portal");

            // create service collection
            IServiceCollection serviceCollection = new ServiceCollection();

            // add mediakiwi dal
            serviceCollection.AddMediaKiwiDAL(connectionString);

            // build service provider
            Services = serviceCollection.BuildServiceProvider();
        }

        public ServiceProvider Services { get; private set; }
    }
}
