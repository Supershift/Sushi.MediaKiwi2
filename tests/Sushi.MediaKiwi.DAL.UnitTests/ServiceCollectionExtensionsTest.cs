using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.DAL.UnitTests
{
    public class ServiceCollectionExtensionsTest
    {
        [Fact]
        public void AddDalServicesTest()
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddMicroORM(new ConnectionString("", null));
            serviceCollection.AddMediaKiwiDAL();
            var serviceProvider = serviceCollection.BuildServiceProvider();
            
            serviceProvider.GetRequiredService<ISectionRepository>();
            serviceProvider.GetRequiredService<ILocaleRepository>();
            serviceProvider.GetRequiredService<INavigationItemRepository>();
            serviceProvider.GetRequiredService<IRoleRepository>();
            serviceProvider.GetRequiredService<IViewRoleRepository>();
            serviceProvider.GetRequiredService<ILocaleRepository>();
            serviceProvider.GetRequiredService<ITranslationRepository>();
        }
    }
}