using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class LocaleRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ILocaleRepository _repository;

        public LocaleRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ILocaleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var locales = await _repository.GetAllAsync(true, new Paging.PagingValues(0, 50));

            Assert.True(locales.Count > 1);
        }
    }
}