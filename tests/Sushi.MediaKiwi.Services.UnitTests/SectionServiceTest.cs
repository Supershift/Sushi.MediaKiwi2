using AutoMapper;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class SectionServiceTest
    {        
        [Fact]
        public async Task GetAllSectionsTest()
        {
            // arrange
            var sectionStubs = new QueryListResult<DAL.Section>
            {
                new DAL.Section(),
                new DAL.Section()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var repositoryMock = new Mock<ISectionRepository>();
            repositoryMock.Setup(x => x.GetAllAsync()).ReturnsAsync(sectionStubs);

            var service = new SectionService(repositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync();

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);            
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }
    }
}