using AutoMapper;
using Moq;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class TranslationServiceTest
    {
        [Fact]
        public async Task GetAllTranslationsTest()
        {
            // arrange
            var stubs = new QueryListResult<DAL.Translation>
            {
                new DAL.Translation() { Key = "delete", Value = "verwijderen"},
                new DAL.Translation() { Key = "edit", Value = "bewerken"}
            };

            string localeId = "en-US";
            string ns = "someNamespace";

            var translationRepositoryMock = new Mock<ITranslationRepository>();
            translationRepositoryMock.Setup(x => x.GetAllAsync(It.Is<string>(x=>x == localeId), It.Is<string>(x=>x == ns))).ReturnsAsync(stubs);

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
        public async Task AddTranslationTest()
        {
            // arrange
            string localeId = "nl";
            string ns = "someNamespace";
            string key = "delete";
            string value = "verwijderen";

            var translationRepositoryMock = new Mock<ITranslationRepository>();
            translationRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.Translation>())).Verifiable();

            // act
            var service = new TranslationService(translationRepositoryMock.Object);
            var result = await service.AddAsync(localeId, ns, key, value);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            translationRepositoryMock.Verify(x=>x.InsertAsync(It.IsAny<DAL.Translation>()), Times.Once);
        }
    }
}
