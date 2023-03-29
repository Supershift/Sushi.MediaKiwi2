using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class ScreenRoleRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly IScreenRoleRepository _repository;

        public ScreenRoleRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<IScreenRoleRepository>();
        }
        
        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync();

            Assert.Equal(1, items.Count);
        }
    }
}