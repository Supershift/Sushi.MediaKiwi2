using AutoMapper;
using Sushi.MediaKiwi.DAL.Sorting;
using AutoMapper.Extensions.ExpressionMapping;

namespace Sushi.MediaKiwi.Services.UnitTests
{
    public class AutoMapperExtensionsTest
    {
        private MapperConfiguration config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<TestSource, TestDestination>().ForMember(x => x.Id, o => o.Ignore());
                cfg.CreateMap<TestDestination, TestSource>();
                cfg.AddExpressionMapping();
            });


        [Fact]
        public void MapTest_Field()
        {
            // Arrange            
            var mapper = config.CreateMapper();
            var sortValues = new SortValues<TestSource>(x => x.Name, SortDirection.ASC);

            // Act
            var result = mapper.MapSortValues<TestDestination>(sortValues);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void MapTest_Direction()
        {
            // Arrange            
            var mapper = config.CreateMapper();
            var sortValues = new SortValues<TestSource>(x => x.Name, SortDirection.DESC);

            // Act
            var result = mapper.MapSortValues<TestDestination>(sortValues);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(SortDirection.DESC, result.Direction);
        }

        [Fact]
        public void MapTest_FieldWithIgnore()
        {
            // Arrange            
            var mapper = config.CreateMapper();
            var sortValues = new SortValues<TestSource>(x => x.Name, SortDirection.ASC);

            // Act
            var result = mapper.MapSortValues<TestDestination>(sortValues);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void MapTest_DoesNotExist()
        {
            // Arrange            
            var mapper = config.CreateMapper();
            var sortValues = new SortValues<TestSource>(x => x.Unmapped, SortDirection.DESC);

            // Act
            var action = () => mapper.MapSortValues<TestDestination>(sortValues);

            // Assert
            Assert.Throws<AutoMapperMappingException>(action);
        }

        [Fact]
        public void MapTest_Null()
        {
            // Arrange            
            var mapper = config.CreateMapper();

            // Act
            var result = mapper.MapSortValues<TestDestination>(null);

            // Assert
            Assert.Null(result);
        }

        public class TestSource
        {
            public int Id { get; set; }
            public string? Name { get; set; }
            public string? Unmapped { get; set; }
        }

        public class TestDestination
        {
            public int Id { get; set; }
            public string? Name { get; set; }
        }
    }
}
