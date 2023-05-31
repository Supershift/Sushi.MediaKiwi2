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
        public async Task GetAllLocales()
        {
            // arrange
            var sectionStubs = new QueryListResult<DAL.Locale>
            {
                new DAL.Locale(),
                new DAL.Locale()
            };

            var localeRepositoryMock = new Mock<ILocaleRepository>();
            localeRepositoryMock.Setup(x => x.GetAllAsync(It.Is<bool>(x => x == true), It.IsAny<PagingValues>())).ReturnsAsync(sectionStubs);

            var service = new LocaleService(localeRepositoryMock.Object, _mapper);

            // act
            var result = await service.GetAllAsync(true, PagingValues.Default);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }
    }
}
