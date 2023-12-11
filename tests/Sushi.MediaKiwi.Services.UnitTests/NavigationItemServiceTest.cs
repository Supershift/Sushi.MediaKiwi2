using AutoMapper;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.DAL.User;
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
            repositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>())).ReturnsAsync(stubs);

            var userProviderMock = new Mock<IUserProvider>();
            userProviderMock.Setup(x => x.GetRole()).Returns("Admin");

            var sectionRoleRepositoryMock = new Mock<ISectionRoleRepository>();
            sectionRoleRepositoryMock.Setup(x => x.GetAllAsync(null)).ReturnsAsync(new QueryListResult<DAL.SectionRole>());

            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new NavigationItemService(repositoryMock.Object, mapper, userProviderMock.Object, sectionRoleRepositoryMock.Object, viewRoleRepositoryMock.Object);

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
                .Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>()))
                .Callback((int? screenID, PagingValues pagingValues) => actualFilterID = screenID)
                .ReturnsAsync(new QueryListResult<DAL.NavigationItem>());

            var userProviderMock = new Mock<IUserProvider>();
            userProviderMock.Setup(x => x.GetRole()).Returns("Admin");

            var sectionRoleStub = new QueryListResult<DAL.SectionRole>() { new DAL.SectionRole() { SectionId = 11, Role = "Admin" } };
            var sectionRoleRepositoryMock = new Mock<ISectionRoleRepository>();
            sectionRoleRepositoryMock.Setup(x => x.GetAllAsync(null)).ReturnsAsync(sectionRoleStub);

            var viewRoleRepositoryStub = new QueryListResult<DAL.ViewRole>() { new DAL.ViewRole() };
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(null)).ReturnsAsync(viewRoleRepositoryStub);

            var service = new NavigationItemService(repositoryMock.Object, mapper, userProviderMock.Object, sectionRoleRepositoryMock.Object, viewRoleRepositoryMock.Object);

            // act
            var result = await service.GetAllAsync(expectedFilterID, PagingValues.Default);

            // assert
            Assert.Equal(expectedFilterID, actualFilterID);
        }
    }
}