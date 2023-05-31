using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
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
            serviceCollection.AddMediaKiwiApi("");
            var serviceProvider = serviceCollection.BuildServiceProvider();

            // get all controllers
            var asm = Assembly.GetAssembly(typeof(MediaKiwiControllerBase));

            Assert.NotNull(asm);

            var controllers = asm.GetTypes().Where(type => typeof(ControllerBase).IsAssignableFrom(type) && !type.IsAbstract);

            // try to create instances of all controllers
            foreach (var controller in controllers)
            {
                ActivatorUtilities.CreateInstance(serviceProvider, controller);
            }

            Assert.NotEmpty(controllers);
        }
    }
}