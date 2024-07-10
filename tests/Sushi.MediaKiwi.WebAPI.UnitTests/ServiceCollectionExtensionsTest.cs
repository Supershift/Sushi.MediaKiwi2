using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi;
using Sushi.MicroORM;
using System.Reflection;

namespace Sushi.MediaKiwi.WebAPI.UnitTests
{
    public class ServiceCollectionExtensionsTest
    {
        [Fact]
        public void CreateControllersTest()
        {
            // build service provider
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddMicroORM(new ConnectionString("", null));
            serviceCollection.AddMediaKiwi();
            
            var serviceProvider = serviceCollection.BuildServiceProvider();

            // get all controllers
            var assembly = Assembly.GetAssembly(typeof(MediaKiwiControllerBase));

            Assert.NotNull(assembly);

            var controllers = assembly.GetTypes().Where(type => typeof(ControllerBase).IsAssignableFrom(type) && !type.IsAbstract);

            // try to create instances of all controllers
            foreach (var controller in controllers)
            {
                ActivatorUtilities.CreateInstance(serviceProvider, controller);
            }

            Assert.NotEmpty(controllers);
        }
    }
}