using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class TranslationRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ITranslationRepository _repository;

        public TranslationRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ITranslationRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var translations = await _repository.GetAllAsync("en", "common");

            Assert.True(translations.Count > 1);
        }
    }
}