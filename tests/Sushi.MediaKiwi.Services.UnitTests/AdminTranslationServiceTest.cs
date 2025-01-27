using Moq;
using Sushi.MediaKiwi.Services.Entities;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class AdminTranslationServiceTest : IClassFixture<TestFakes>
    {
        private readonly TestFakes _fakes;

        public AdminTranslationServiceTest(TestFakes fakes)
        {
            _fakes = fakes;
        }

        [Fact]
        public async Task GetNamespacesTest()
        {
            // arrange
            string localeId = "nl-NL";
            var namespaces = new List<string?>() { "namespace1", "namespace2" };
            var repository = new Mock<ITranslationRepository>();

            repository.Setup(x => x.GetNamespacesAsync(localeId)).ReturnsAsync(namespaces);

            var services = new AdminTranslationService(repository.Object, _fakes.Mapper);

            // act
            var result = await services.GetNamespacesAsync(localeId);

            // assert
            Assert.Null(result.Error);
            Assert.NotNull(result.Value?.Result);
            Assert.Equal(namespaces, result.Value.Result);
        }

        [Fact]
        public async Task GetAllTest()
        {
            // arrange
            string localeId = "en-US";
            string @namespace = "namespace";
            string key = "key";
            string value = "val";

            var translations = new QueryListResult<Translation>() { new Translation() { Key = "some key", Value = "some value", Namespace = "some ns", IsNew = true, LocaleId = "en-US" } };

            var repository = new Mock<ITranslationRepository>();
            repository.Setup(x => x.GetAllAsync(localeId, @namespace, key, value)).ReturnsAsync(translations);
            var services = new AdminTranslationService(repository.Object, _fakes.Mapper);

            // act
            var result = await services.GetAllAsync(localeId, @namespace, key, value);

            // assert
            Assert.Null(result.Error);
            Assert.NotNull(result.Value?.Result);
            Assert.Equal(translations.Count, result.Value.Result.Count);
            Assert.Equal(translations[0].Key, result.Value.Result[0].Key);
        }

        [Fact]
        public async Task UpdateTest()
        {
            // arrange
            string localeId = "en-US";
            string @namespace = "orders";
            string key = "key";
            var request = new Model.UpdateTranslationRequest()
            {   
                Value = "new value"
            };
            var translation = new Translation()
            {
                Key = key,
                LocaleId = localeId,
                Namespace = @namespace,
                Value = "old value"
            };

            var repository = new Mock<ITranslationRepository>();
            repository.Setup(x => x.GetAsync(localeId, @namespace, key)).ReturnsAsync(translation);
            repository.Setup(x => x.UpdateAsync(It.Is<Translation>(x => x.Key == key && x.Value == request.Value))).Verifiable(Times.Once);
            
            var services = new AdminTranslationService(repository.Object, _fakes.Mapper);

            // act
            var result = await services.UpdateTranslationAsync(localeId, @namespace, key, request);

            // assert
            Assert.Null(result.Error);
            repository.Verify();
        }

        [Fact]
        public async Task DeleteTest()
        {
            string localeId = "en-US";
            string @namespace = "orders";
            string key = "key";
            var translation = new Translation()
            {
                Key = key,
                LocaleId = localeId,
                Namespace = @namespace,
                Value = "old value"
            };

            var repository = new Mock<ITranslationRepository>();
            repository.Setup(x => x.GetAsync(localeId, @namespace, key)).ReturnsAsync(translation);
            repository.Setup(x => x.DeleteAsync(It.Is<Translation>(x => x.Key == key))).Verifiable(Times.Once);

            var services = new AdminTranslationService(repository.Object, _fakes.Mapper);

            // act
            var result = await services.DeleteTranslationAsync(localeId, @namespace, key);

            // assert
            Assert.Null(result.Error);
            repository.Verify();

        }
    }
}
