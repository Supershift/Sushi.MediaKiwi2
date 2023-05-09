using AutoMapper;
using AutoMapper.Extensions.ExpressionMapping;
using Moq;
using NuGet.Frameworks;
using Sushi.MediaKiwi.DAL.Paging;
using Sushi.MediaKiwi.DAL.Repository;
using Sushi.MediaKiwi.DAL.Sorting;
using Sushi.MediaKiwi.Services.Model;
using Sushi.MicroORM;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class ViewServiceTest
    {
        private readonly IMapper _mapper;
        
        public ViewServiceTest()
        {
            var config = new MapperConfiguration(cfg =>
            {   
                cfg.AddProfile<AutoMapperProfile>();
                cfg.AddExpressionMapping();
            });
            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task DeleteViewTest()
        {
            // arrange
            var viewStub = new DAL.View()
            {
                Id = 11
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(viewStub.Id)).ReturnsAsync(viewStub);
            viewRepositoryMock.Setup(x => x.DeleteAsync(viewStub.Id)).Verifiable();
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();            

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync(viewStub.Id);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            viewRepositoryMock.Verify(x=>x.DeleteAsync(viewStub.Id), Times.Once);
        }

        [Fact]
        public async Task DeleteViewTest_NotFound()
        {
            // arrange
            DAL.View? viewStub = null;
            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync(17);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
            
        }

        [Fact]
        public async Task GetAllViewsTest()
        {
            // arrange
            var viewStubs = new QueryListResult<DAL.View>
            {
                new DAL.View(),
                new DAL.View()
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>(), null)).ReturnsAsync(viewStubs);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(null)).ReturnsAsync(new QueryListResult<DAL.ViewRole>());

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

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
            
            var repositoryMock = new Mock<IViewRepository>();
            repositoryMock
                .Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>(), null))
                .Callback( (int? viewID, PagingValues pagingValues, DAL.Sorting.SortValues<DAL.View>? sort) => actualFilterID = viewID)
                .ReturnsAsync(new QueryListResult<DAL.View>());
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(repositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

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

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>(), null)).ReturnsAsync(viewStubs);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>())).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

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

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.Is<int>(x=>x == viewStub.Id))).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int>())).ReturnsAsync(new QueryListResult<DAL.ViewRole>());
            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.GetAsync(11);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(viewStub.Id, result.Value.Id);
        }

        [Fact]
        public async Task GetViewTest_NotFound()
        {
            // arrange
            DAL.View? viewStub = null;
            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync(17);

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task SaveViewTest_NotFound()
        {
            // arrange
            DAL.View? viewStub = null;
            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.IsAny<int>())).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.SaveAsync(17, new View());

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task SaveViewTest_Create()
        {
            // arrange
            var view = new View()
            {
                ComponentKey = "comp",
                ExternalId = "123",
                Name = "name",
                Roles = new List<string>() { "Admin", "User" },
                SectionId = 2
            };


            int newId = 12;
            var dalResult = new DAL.View() { Id = newId };

            var roleStubs = new QueryListResult<DAL.ViewRole>
            {
                new DAL.ViewRole() { ViewId = newId, Role = "Admin" },
                new DAL.ViewRole() { ViewId = newId, Role = "User" }
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.SaveAsync(It.IsAny<DAL.View>())).Callback<DAL.View>(x => x.Id = newId);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.DeleteForViewAsync(It.IsAny<int>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.ViewRole>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>())).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.SaveAsync(null, view);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);
            viewRoleRepositoryMock.Verify(x => x.DeleteForViewAsync(It.IsAny<int>()), Times.Never);
            viewRoleRepositoryMock.Verify(x => x.InsertAsync(It.IsAny<DAL.ViewRole>()), Times.Exactly(2));
        }

        [Fact]
        public async Task SaveViewTest_Update()
        {
            // arrange
            var view = new View()
            {
                ComponentKey = "comp",
                ExternalId = "123",
                Name = "name",
                Roles = new List<string>() { "Admin", "User" },
                SectionId = 2
            };


            int existingId = 17;
            var dalResult = new DAL.View() { Id = existingId };

            var roleStubs = new QueryListResult<DAL.ViewRole>
            {
                new DAL.ViewRole() { ViewId = existingId, Role = "Admin" },
                new DAL.ViewRole() { ViewId = existingId, Role = "User" }
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(dalResult).Verifiable();
            viewRepositoryMock.Setup(x => x.SaveAsync(dalResult)).Verifiable();
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.DeleteForViewAsync(It.IsAny<int>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.ViewRole>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>())).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.SaveAsync(existingId, view);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(existingId, result.Value.Id);
            viewRepositoryMock.Verify(x=>x.GetAsync(existingId), Times.Once);
            viewRepositoryMock.Verify(x=>x.SaveAsync(dalResult), Times.Once);
            viewRoleRepositoryMock.Verify(x => x.DeleteForViewAsync(It.IsAny<int>()), Times.Once);
            viewRoleRepositoryMock.Verify(x => x.InsertAsync(It.IsAny<DAL.ViewRole>()), Times.Exactly(2));
        }


    }
}