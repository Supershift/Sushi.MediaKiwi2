using AutoMapper;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class ScreenServiceTest
    {        
        [Fact]
        public async Task GetAllScreensTest()
        {
            // arrange
            var screenStubs = new QueryListResult<DAL.Screen>
            {
                new DAL.Screen(),
                new DAL.Screen()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var screenRepositoryMock = new Mock<IScreenRepository>();
            screenRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>())).ReturnsAsync(screenStubs);
            var screenRoleRepositoryMock = new Mock<IScreenRoleRepository>();
            screenRoleRepositoryMock.Setup(x => x.GetAllAsync()).ReturnsAsync(new QueryListResult<DAL.ScreenRole>());

            var service = new ScreenService(screenRepositoryMock.Object, screenRoleRepositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(null, PagingValues.Default);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);            
            Assert.NotNull(result.Value);
            Assert.NotNull(result.Value.Result);
            Assert.Equal(2, result.Value.Result.Count);
        }

        [Fact]
        public async Task GetAllScreensTest_Filters()
        {
            // arrange
            int? actualFilterID = null;
            int? expectedFilterID = 1;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            
            var repositoryMock = new Mock<IScreenRepository>();
            repositoryMock
                .Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>()))
                .Callback( (int? screenID, PagingValues pagingValues) => actualFilterID = screenID)
                .ReturnsAsync(new QueryListResult<DAL.Screen>());
            var screenRoleRepositoryMock = new Mock<IScreenRoleRepository>();

            var service = new ScreenService(repositoryMock.Object, screenRoleRepositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(expectedFilterID, PagingValues.Default);

            // assert
            Assert.Equal(expectedFilterID, actualFilterID);
        }

        [Fact]
        public async Task GetAllScreensTest_Roles()
        {
            // arrange
            var screenStubs = new QueryListResult<DAL.Screen>
            {
                new DAL.Screen() { Id = 1 },
                new DAL.Screen() { Id = 2 }
            };
            var roleStubs = new QueryListResult<DAL.ScreenRole>
            {
                new DAL.ScreenRole() { ScreenId = 1, Role = "Admin" }
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var screenRepositoryMock = new Mock<IScreenRepository>();
            screenRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>())).ReturnsAsync(screenStubs);
            var screenRoleRepositoryMock = new Mock<IScreenRoleRepository>();
            screenRoleRepositoryMock.Setup(x => x.GetAllAsync()).ReturnsAsync(roleStubs);

            var service = new ScreenService(screenRepositoryMock.Object, screenRoleRepositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(null, PagingValues.Default);

            // assert            
            var screen1 = result.Value.Result.First(x => x.Id == 1);
            var screen2 = result.Value.Result.First(x => x.Id == 2);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.Single(screen1.Roles);
            Assert.Empty(screen2.Roles);
            Assert.Equal("Admin", screen1.Roles[0]);
        }
    }
}