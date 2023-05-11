using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class SectionRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ISectionRepository _repository;

        public SectionRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ISectionRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var sections = await _repository.GetAllAsync(new Paging.PagingValues(0, 50));

            Assert.True(sections.Count > 1);
        }
    }
}