using Moq;
using Sushi.MediaKiwi.Services.Interfaces;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class TranslationServiceTest
    {
        [Fact]
        public async Task GetAllTranslationsTest()
        {
            // arrange
            var stubs = new QueryListResult<Entities.Translation>
            {
                new Entities.Translation() { Key = "delete", Value = "verwijderen"},
                new Entities.Translation() { Key = "edit", Value = "bewerken"}
            };

            string localeId = "en-US";
            string ns = "someNamespace";

            var translationRepositoryMock = new Mock<ITranslationRepository>();
            translationRepositoryMock.Setup(x => x.GetAllAsync(localeId, ns, null, null)).ReturnsAsync(stubs);

            var service = new TranslationService(translationRepositoryMock.Object);

            // act
            var result = await service.GetAllAsync(localeId, ns);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(2, result.Value.Count);
            Assert.Equal(stubs[0].Key, result.Value.Keys.ToArray()[0]);
            Assert.Equal(stubs[0].Value, result.Value.Values.ToArray()[0]);
        }

        [Fact]
        public async Task AddMissingTranslationTest()
        {
            // arrange
            string localeId = "nl";
            string ns = "someNamespace";
            string key = "delete";
            string value = "verwijderen";

            var translationRepositoryMock = new Mock<ITranslationRepository>();
            translationRepositoryMock.Setup(x => x.InsertMissingAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Verifiable();

            // act
            var service = new TranslationService(translationRepositoryMock.Object);
            var result = await service.AddMissingAsync(localeId, ns, key, value);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            translationRepositoryMock.Verify(x=> x.InsertMissingAsync(ns, key, value));
        }
    }
}
