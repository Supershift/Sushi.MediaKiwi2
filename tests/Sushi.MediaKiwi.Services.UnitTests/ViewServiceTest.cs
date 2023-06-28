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
                Id = "abc"
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
            viewRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync("abc");

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
                new DAL.View() { Id = "abc" },
                new DAL.View() { Id = "def" }
            };
            var roleStubs = new QueryListResult<DAL.ViewRole>
            {
                new DAL.ViewRole() { ViewId = "abc", Role = "Admin" }
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<int?>(), It.IsAny<PagingValues>(), null)).ReturnsAsync(viewStubs);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<string?>())).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.GetAllAsync(null, PagingValues.Default);

            // assert            
            var view1 = result.Value.Result.First(x => x.Id == "abc");
            var view2 = result.Value.Result.First(x => x.Id == "def");
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
                Id = "abc"
            };                

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.Is<string>(x=>x == viewStub.Id))).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<string>())).ReturnsAsync(new QueryListResult<DAL.ViewRole>());
            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.GetAsync("abc");

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
            viewRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.DeleteAsync("def");

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }

        [Fact]
        public async Task CreateViewTest()
        {
            // arrange
            var view = new View()
            {
                Id = "value to be ignored",
                ComponentKey = "comp",                
                Name = "name",
                Roles = new List<string>() { "Admin", "User" },
                SectionId = 2
            };

            string newId = "abc";
            var dalResult = new DAL.View() { Id = newId };

            var roleStubs = new QueryListResult<DAL.ViewRole>
            {
                new DAL.ViewRole() { ViewId = newId, Role = "Admin" },
                new DAL.ViewRole() { ViewId = newId, Role = "User" }
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.InsertAsync(It.Is<DAL.View>(x=>x.Id == newId))).Callback<DAL.View>(x => x.Id = newId);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.DeleteForViewAsync(It.IsAny<string>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.ViewRole>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.Is<string?>(x => x == newId))).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.CreateAsync(newId, view);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(newId, result.Value.Id);
            viewRoleRepositoryMock.Verify(x => x.DeleteForViewAsync(It.IsAny<string>()), Times.Never);
            viewRoleRepositoryMock.Verify(x => x.InsertAsync(It.IsAny<DAL.ViewRole>()), Times.Exactly(2));
        }

        

        [Fact]
        public async Task UpdateViewTest()
        {
            // arrange
            var view = new View()
            {
                Id = "value to be ignored",
                ComponentKey = "comp",                
                Name = "name",
                Roles = new List<string>() { "Admin", "User" },
                SectionId = 2
            };


            string existingId = "xyz";
            var dalResult = new DAL.View() { Id = existingId };

            var roleStubs = new QueryListResult<DAL.ViewRole>
            {
                new DAL.ViewRole() { ViewId = existingId, Role = "Admin" },
                new DAL.ViewRole() { ViewId = existingId, Role = "User" }
            };

            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(existingId)).ReturnsAsync(dalResult).Verifiable();
            viewRepositoryMock.Setup(x => x.UpdateAsync(dalResult)).Verifiable();
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();
            viewRoleRepositoryMock.Setup(x => x.DeleteForViewAsync(It.IsAny<string>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.InsertAsync(It.IsAny<DAL.ViewRole>())).Verifiable();
            viewRoleRepositoryMock.Setup(x => x.GetAllAsync(It.IsAny<string?>())).ReturnsAsync(roleStubs);

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.UpdateAsync(existingId, view);

            Assert.NotNull(result);
            Assert.Equal(ResultCode.Success, result.Code);
            Assert.NotNull(result.Value);
            Assert.Equal(existingId, result.Value.Id);
            viewRepositoryMock.Verify(x=>x.GetAsync(existingId), Times.Once);
            viewRepositoryMock.Verify(x=>x.UpdateAsync(dalResult), Times.Once);
            viewRoleRepositoryMock.Verify(x => x.DeleteForViewAsync(It.IsAny<string>()), Times.Once);
            viewRoleRepositoryMock.Verify(x => x.InsertAsync(It.IsAny<DAL.ViewRole>()), Times.Exactly(2));
        }

        [Fact]
        public async Task UpdateViewTest_NotFound()
        {
            // arrange
            DAL.View? viewStub = null;
            var viewRepositoryMock = new Mock<IViewRepository>();
            viewRepositoryMock.Setup(x => x.GetAsync(It.IsAny<string>())).ReturnsAsync(viewStub);
            var viewRoleRepositoryMock = new Mock<IViewRoleRepository>();

            var service = new ViewService(viewRepositoryMock.Object, viewRoleRepositoryMock.Object, _mapper);

            // act
            var result = await service.UpdateAsync("jkl", new View());

            // assert
            Assert.NotNull(result);
            Assert.Equal(ResultCode.NotFound, result.Code);
        }
    }
}