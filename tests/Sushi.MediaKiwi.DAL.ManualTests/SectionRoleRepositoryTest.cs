using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class SectionRepositoryRoleTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ISectionRoleRepository _repository;

        public SectionRepositoryRoleTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ISectionRoleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync(null);

            Assert.True(sections.Count > 1);
        }
    }
}