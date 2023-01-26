using AutoMapper;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class NavigationItemServiceTest
    {        
        [Fact]
        public async Task GetAllNavigationItemTest()
        {
            // arrange
            var stubs = new QueryListResult<DAL.NavigationItem>
            {
                new DAL.NavigationItem(),
                new DAL.NavigationItem()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var repositoryMock = new Mock<INavigationItemRepository>();
            repositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>())).ReturnsAsync(stubs);

            var service = new NavigationItemService(repositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(null);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);            
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }

        [Fact]
        public async Task GetAllNavigationItemsTest_Filters()
        {
            // arrange
            int? actualFilterID = null;
            int? expectedFilterID = 1;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            
            var repositoryMock = new Mock<INavigationItemRepository>();
            repositoryMock
                .Setup(x => x.GetAllAsync(It.IsAny<int?>()))
                .Callback( (int? screenID) => actualFilterID = screenID)
                .ReturnsAsync(new QueryListResult<DAL.NavigationItem>());

            var service = new NavigationItemService(repositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(expectedFilterID);

            // assert
            Assert.Equal(expectedFilterID, actualFilterID);
        }
    }
}