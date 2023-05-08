using Sushi.MediaKiwi.WebAPI.Sorting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting
{
    public class SortMapTest
    {
        [Fact]
        public void GetSortFields_ReturnsCorrectFields()
        {
            // arrange
            var map = new SortMap<TestFake>();

            // act
            map.Add(x => x.Id);
            map.Add(x => x.Name);
            var result = map.GetSortFields();
            
            // assert
            Assert.Equal(2, result.Count());
            Assert.Contains("Name", result);
            Assert.Contains("Id", result);
        }

        [Fact]
        public void AddFields_NonGeneric()
        {
            // arrange
            ISortMap map = new SortMap<TestFake>();
            Expression<Func<TestFake, object>> expression = x => x.Id;

            // act
            map.Add(expression);                        
            var result = map.GetSortFields();
            
            // assert            
            Assert.Contains("Id", result);
        }

        [Fact]
        public void AddFields_NonGeneric_TypeMismatch()
        {
            // arrange
            ISortMap map = new SortMap<TestFake>();
            Expression<Func<object, object>> expression = x => x;

            // act
            var action = () => map.Add(expression);

            // assert            
            Assert.Throws<ArgumentException>(action);
        }

        [Fact]
        public void GetItem()
        {
            // arrange
            var map = new SortMap<TestFake>();
            Expression<Func<TestFake, object>> expression = x => x.Name;

            // act
            map.Add(x => x.Id);
            map.Add(expression);
            var result = map.GetItem("Name");

            // assert
            Assert.NotNull(result);
            Assert.Equal(expression, result);            
        }

        [Fact]
        public void GetItem_NonGeneric()
        {
            // arrange
            var map = new SortMap<TestFake>();
            Expression<Func<TestFake, object>> expression = x => x.Name;

            // act
            map.Add(x => x.Id);
            map.Add(expression);
            var result = ((ISortMap)map).GetItem("Name");

            // assert
            Assert.NotNull(result);
            Assert.Equal(expression, result);
        }

        [Fact]
        public void GetItem_DoesNotExist()
        {
            // arrange
            var map = new SortMap<TestFake>();
            Expression<Func<TestFake, object>> expression = x => x.Name;

            // act
            map.Add(x => x.Id);
            map.Add(expression);
            var result = map.GetItem("does not exist");

            // assert
            Assert.Null(result);            
        }
    }
}
