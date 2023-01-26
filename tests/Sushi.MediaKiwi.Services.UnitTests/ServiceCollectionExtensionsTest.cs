using Microsoft.Extensions.DependencyInjection;


namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class ServiceCollectionExtensionsTest
    {
        [Fact]
        public void AddMediaKiwiServicesTest()
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddMediaKiwiServices("");
            var serviceProvider = serviceCollection.BuildServiceProvider();

            serviceProvider.GetRequiredService<SectionService>();
            serviceProvider.GetRequiredService<ScreenService>();
            serviceProvider.GetRequiredService<NavigationItemService>();
        }
    }
}