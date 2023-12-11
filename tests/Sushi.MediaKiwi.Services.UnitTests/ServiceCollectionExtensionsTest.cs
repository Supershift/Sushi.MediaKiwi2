using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.User;
using Sushi.MediaKiwi.Services.UnitTests.Mocks;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class ServiceCollectionExtensionsTest
    {
        [Fact]
        public void AddMediaKiwiServicesTest()
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddMediaKiwiServices("");

            serviceCollection.AddTransient<IUserProvider, UserProvider>();

            var serviceProvider = serviceCollection.BuildServiceProvider();

            serviceProvider.GetRequiredService<SectionService>();
            serviceProvider.GetRequiredService<ViewService>();
            serviceProvider.GetRequiredService<NavigationItemService>();
            serviceProvider.GetRequiredService<RoleService>();
        }
    }
}