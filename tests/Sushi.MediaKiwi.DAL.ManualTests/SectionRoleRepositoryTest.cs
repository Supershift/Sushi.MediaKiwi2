using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class SectionRoleRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ISectionRoleRepository _repository;

        public SectionRoleRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ISectionRoleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var items = await _repository.GetAllAsync(null);

            Assert.NotEmpty(items);
        }
    }
}