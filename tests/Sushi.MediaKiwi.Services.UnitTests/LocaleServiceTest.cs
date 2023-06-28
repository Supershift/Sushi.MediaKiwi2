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
    public class LocaleServiceTest
    {
        private readonly IMapper _mapper;

        public LocaleServiceTest()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task GetAllLocalesTest()
        {
            // arrange
            var stubs = new QueryListResult<DAL.Locale>
            {
                new DAL.Locale(),
                new DAL.Locale()
            };

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.GetAllAsync(It.Is<bool>(x => x == true), It.IsAny<PagingValues>())).ReturnsAsync(stubs);

            var service = new LocaleService(localeRepositoryMock.Object, null, _mapper);

            // act
            var result = await service.GetAllAsync(true, PagingValues.Default);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }

        [Fact]
        public async Task GetLocaleTest()
        {
            // arrange
            string existingId = "abc";
            var existingLocale = new DAL.Locale()
            {
                Id = existingId,
                Name = "Existing",
            };
            var resultLocale = new Locale();

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(existingLocale);            

            var translationRepositoryMock = new Mock<ITranslationRepository>();

            var mapperMock = new Mock<IMapper>();                        
            mapperMock.Setup(x => x.Map<Locale>(It.IsAny<DAL.Locale>())).Returns(resultLocale);

            var service = new LocaleService(localeRepositoryMock.Object, translationRepositoryMock.Object, mapperMock.Object);

            // act
            var result = await service.GetAsync(existingId);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.Equal(resultLocale, result.Value);
        }

        [Fact]
        public async Task GetLocaleTest_NotFound()
        {
            // arrange
            string existingId = "abc";
            DAL.Locale? existingLocale = null;

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(existingLocale);

            var translationRepositoryMock = new Mock<ITranslationRepository>();

            var mapperMock = new Mock<IMapper>();            

            var service = new LocaleService(localeRepositoryMock.Object, translationRepositoryMock.Object, mapperMock.Object);

            // act
            var result = await service.GetAsync(existingId);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
            Assert.Null(result.Value);
        }

        [Fact]
        public async Task CreateLocaleTest()
        {
            // arrange
            var locale = new Locale()
            {
                IsEnabled = true,
                Name = "Test",
            };

            var defaultLocale = new DAL.Locale()
            {
                Id = "def",
                Name = "Default",
            };

            string newId = "abc";

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.Locale>())).Verifiable();
            localeRepositoryMock.Setup(x=>x.GetDefaultAsync()).ReturnsAsync(defaultLocale);
            var translationRepositoryMock = new Mock<ITranslationRepository>();
            translationRepositoryMock.Setup(x => x.DuplicateAsync(It.IsAny<string>(), It.IsAny<string>())).Verifiable();

            var service = new LocaleService(localeRepositoryMock.Object, translationRepositoryMock.Object, _mapper);

            // act
            var result = await service.CreateAsync(newId, locale);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);
            localeRepositoryMock.Verify(x => x.InsertAsync(It.Is<DAL.Locale>(x => x.Id == newId)), Times.Once);
            translationRepositoryMock.Verify(x => x.DuplicateAsync(defaultLocale.Id, newId), Times.Once);
        }

        [Fact]
        public async Task CreateLocaleTest_NoDefault()
        {
            // arrange
            var locale = new Locale()
            {
                IsEnabled = true,
                Name = "Test",
            };

            DAL.Locale? defaultLocale = null;            

            string newId = "abc";

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.Locale>())).Verifiable();
            localeRepositoryMock.Setup(x => x.GetDefaultAsync()).ReturnsAsync(defaultLocale);
            var translationRepositoryMock = new Mock<ITranslationRepository>();
            translationRepositoryMock.Setup(x => x.DuplicateAsync(It.IsAny<string>(), It.IsAny<string>())).Verifiable();

            var service = new LocaleService(localeRepositoryMock.Object, translationRepositoryMock.Object, _mapper);

            // act
            var result = await service.CreateAsync(newId, locale);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);
            localeRepositoryMock.Verify(x => x.InsertAsync(It.Is<DAL.Locale>(x => x.Id == newId)), Times.Once);
            translationRepositoryMock.Verify(x => x.DuplicateAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task DeleteLocaleTest()
        {
            // arrange
            string existingId = "abc";
            var existingLocale = new DAL.Locale()
            {
                Id = existingId,
                Name = "Existing",
            };            

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(existingLocale);
            localeRepositoryMock.Setup(x => x.DeleteAsync(It.IsAny<DAL.Locale>())).Verifiable();

            var translationRepositoryMock = new Mock<ITranslationRepository>();

            var mapperMock = new Mock<IMapper>();            

            var service = new LocaleService(localeRepositoryMock.Object, translationRepositoryMock.Object, mapperMock.Object);

            // act
            var result = await service.DeleteAsync(existingId);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            localeRepositoryMock.Verify(x=>x.DeleteAsync(existingLocale), Times.Once);
        }

        [Fact]
        public async Task UpdateLocaleTest()
        {
            // arrange
            var locale = new Locale()
            {
                IsEnabled = true,
                Name = "Test",
            };

            string existingId = "abc";
            var existingLocale = new DAL.Locale()
            {
                Id = existingId,
                Name = "Existing",
            };

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(existingLocale);
            localeRepositoryMock.Setup(x => x.UpdateAsync(It.IsAny<DAL.Locale>())).Verifiable();

            var translationRepositoryMock = new Mock<ITranslationRepository>();

            var mapperMock = new Mock<IMapper>();
            mapperMock.Setup(x => x.Map(It.IsAny<Locale>(), It.IsAny<DAL.Locale>())).Verifiable();
            mapperMock.Setup(x => x.Map(It.IsAny<DAL.Locale>(), It.IsAny<Locale>())).Verifiable();

            var service = new LocaleService(localeRepositoryMock.Object, translationRepositoryMock.Object, mapperMock.Object);

            // act
            var result = await service.UpdateAsync(existingId, locale);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);            
            localeRepositoryMock.Verify(x => x.UpdateAsync(existingLocale), Times.Once());
            mapperMock.Verify(x => x.Map(locale, existingLocale), Times.Once());            
            mapperMock.Verify(x => x.Map(existingLocale, It.IsAny<Locale>()), Times.Once());            
        }
    }
}
