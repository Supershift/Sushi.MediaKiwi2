using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.UnitTests
{
    public class ServiceCollectionExtensionsTest
    {
        [Fact]
        public void AddDalServicesTest()
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddMediaKiwiDAL("");
            var serviceProvider = serviceCollection.BuildServiceProvider();
            
            serviceProvider.GetRequiredService<ISectionRepository>();
            serviceProvider.GetRequiredService<IViewRepository>();
            serviceProvider.GetRequiredService<INavigationItemRepository>();
        }
    }
}