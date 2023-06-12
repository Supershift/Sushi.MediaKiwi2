using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;

namespace Sushi.MediaKiwi.DAL.ManualTests
{
    public class TranslationRepositoryTest : IClassFixture<ConfigFixture>
    {
        private readonly ConfigFixture _configFixture;
        private readonly ITranslationRepository _repository;
        private readonly ILocaleRepository _localeRepository;

        public TranslationRepositoryTest(ConfigFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ITranslationRepository>();
            _localeRepository = _configFixture.Services.GetRequiredService<ILocaleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var translations = await _repository.GetAllAsync("en", "common");

            Assert.True(translations.Count > 1);
        }

        [Fact]
        public async Task DuplicateTest()
        {
            // start transaction to prevent test changing state permanently
            using (var ts = DAL.Utility.CreateTransactionScope())
            {
                // create a new test locale
                var targetLocale=  new DAL.Locale() { Id = "test", IsEnabled = false, Name = "test" };
                await _localeRepository.InsertAsync(targetLocale);

                // duplicate from english
                await _repository.DuplicateAsync("en", targetLocale.Id);

                // get all translations for english and test locale
                var expectedTranslations = await _repository.GetAllAsync("en", null);
                var actualTranslations = await _repository.GetAllAsync(targetLocale.Id, null);

                // assert same keys exist
                Assert.NotEmpty(expectedTranslations);
                Assert.Equal(expectedTranslations.Select(x=>x.Key), actualTranslations.Select(x=>x.Key));
            }
        }
    }
}