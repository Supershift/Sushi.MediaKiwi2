using AutoMapper;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class ViewServiceTest
    {        
        [Fact]
        public async Task GetAllViewsTest()
        {
            // arrange
            var viewStubs = new QueryListResult<DAL.View>
            {
                new DAL.View(),
                new DAL.View()
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>())).ReturnsAsync(viewStubs);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(null)).ReturnsAsync(new QueryListResult<DAL.ViewRole>());

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, mapper);

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
        public async Task GetAllViewsTest_Filters()
        {
            // arrange
            int? actualFilterID = null;
            int? expectedFilterID = 1;

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            
            var repositoryMock = new Mock<IViewRepository>();
            repositoryMock
                .Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>()))
                .Callback( (int? viewID, PagingValues pagingValues) => actualFilterID = viewID)
                .ReturnsAsync(new QueryListResult<DAL.View>());
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(repositoryMock.Object, viewRoleRepositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(expectedFilterID, PagingValues.Default);

            // assert
            Assert.Equal(expectedFilterID, actualFilterID);
        }

        [Fact]
        public async Task GetAllViewsTest_Roles()
        {
            // arrange
            var viewStubs = new QueryListResult<DAL.View>
            {
                new DAL.View() { Id = 1 },
                new DAL.View() { Id = 2 }
            };
            var roleStubs = new QueryListResult<DAL.ViewRole>
            {
                new DAL.ViewRole() { ViewId = 1, Role = "Admin" }
            };

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>())).ReturnsAsync(viewStubs);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>())).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, mapper);

            // act
            var result = await service.GetAllAsync(null, PagingValues.Default);

            // assert            
            var view1 = result.Value.Result.First(x => x.Id == 1);
            var view2 = result.Value.Result.First(x => x.Id == 2);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.Single(view1.Roles);
            Assert.Empty(view2.Roles);
            Assert.Equal("Admin", view1.Roles[0]);
        }

        [Fact]
        public async Task GetViewTest()
        {
            // arrange
            var viewStub = new DAL.View()
            {
                Id = 11
            };                

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<AutoMapperProfile>();
            });
            var mapper = config.CreateMapper();

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.Is<int>(x=>x == viewStub.Id))).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();            

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, mapper);

            // act
            var result = await service.GetAsync(11);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(viewStub.Id, result.Value.Id);
        }
    }
}