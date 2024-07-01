using Microsoft.Extensions.DependencyInjection;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services;
using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Xunit.Extensions.AssemblyFixture;

namespace Sushi.MediaKiwi.IntegrationTests
{
    public class TranslationRepositoryTest : IAssemblyFixture<DatabaseFixture>
    {
        private readonly DatabaseFixture _configFixture;
        private readonly ITranslationRepository _repository;
        private readonly ILocaleRepository _localeRepository;

        public TranslationRepositoryTest(DatabaseFixture configFixture)
        {
            _configFixture = configFixture;
            _repository = _configFixture.Services.GetRequiredService<ITranslationRepository>();
            _localeRepository = _configFixture.Services.GetRequiredService<ILocaleRepository>();
        }

        [Fact]
        public async Task GetAllTest()
        {
            var translations = await _repository.GetAllAsync("en", "common", null, null);

            Assert.NotEmpty(translations);
        }

        [Fact]
        public async Task GetNamespacesTest()
        {
            var namespaces = await _repository.GetNamespacesAsync("en");

            Assert.NotEmpty(namespaces);
        }

        [Fact]
        public async Task DuplicateTest()
        {
            // start transaction to prevent test changing state permanently
            using (var ts = Utility.CreateTransactionScope())
            {
                // create a new test locale
                var targetLocale = new Locale() { Id = "test", IsEnabled = false, Name = "test" };
                await _localeRepository.InsertAsync(targetLocale);

                // duplicate from english
                await _repository.DuplicateAsync("en", targetLocale.Id);

                // get all translations for english and test locale
                var expectedTranslations = await _repository.GetAllAsync("en", null, null, null);
                var actualTranslations = await _repository.GetAllAsync(targetLocale.Id, null, null, null);

                // assert same keys exist
                Assert.NotEmpty(expectedTranslations);
                Assert.Equal(expectedTranslations.Select(x => x.Key), actualTranslations.Select(x => x.Key));
            }
        }

        [Fact]
        public async Task InsertMissingTest()
        {
            // start transaction to prevent test changing state permanently
            using (var ts = Utility.CreateTransactionScope())
            {
                // get all locales
                var allLocales = await _localeRepository.GetAllAsync(false, null);

                // create a new translation for a locale                
                var translation = new Translation()
                {
                    Namespace = "fkgnfgn",
                    Key = "sdfgsdgsd",
                    Value = "test",
                    IsNew = false,
                    LocaleId = "en"
                };
                await _repository.InsertAsync(translation);

                // duplicate for all other locales
                await _repository.InsertMissingAsync(translation.Namespace, translation.Key, translation.Value);

                // get all translations for this key and namespapce                
                var translations = await _repository.GetAllAsync(null, translation.Namespace, translation.Key, null);

                // assert a translation exists for each locale
                Assert.NotEmpty(translations);
                // the original locale has 'is new' false
                Assert.Contains(translation, translations);

                foreach (var locale in allLocales.Where(x => x.Id != translation.LocaleId))
                {
                    var expected = translation with { IsNew = true, LocaleId = locale.Id };
                    Assert.Contains(expected, translations);
                }
            }
        }
    }
}