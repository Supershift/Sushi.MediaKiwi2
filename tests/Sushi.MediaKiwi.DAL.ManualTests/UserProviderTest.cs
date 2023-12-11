using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.DAL.User;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class UserProviderTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly IUserProvider _provider;

        public UserProviderTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _provider = _configFixture.Services.GetRequiredService<IUserProvider>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var role  = _provider.GetRole();

            Assert.True(role == "Admin");
        }
    }
}