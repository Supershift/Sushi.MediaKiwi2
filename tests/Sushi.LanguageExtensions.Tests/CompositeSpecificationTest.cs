using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Tests
{
    public class CompositeSpecificationTest
    {
        [Fact]
        public void IsSatisfiedBy_WithTrueSpec_ReturnsSuccess()
        {
            var spec = new CompositeSpecification<string, Error>(new List<ISpecification<string, Error>> { new AlwaysTrueSpec(), new AlwaysTrueSpec() });

            var result = spec.IsSatisfiedBy("test");

            Assert.True(result.IsSuccess);
        }

        [Fact]
        public void IsSatisfiedBy_WithFalseSpec_ReturnsError()
        {
            var spec = new CompositeSpecification<string, Error>(new List<ISpecification<string, Error>> { new AlwaysTrueSpec(), new AlwaysFalseSpec() });

            var result = spec.IsSatisfiedBy("test");

            Assert.False(result.IsSuccess);            
        }

        [Fact]
        public void IsSatisfiedBy_WithOneFalseSpec_ReturnsError()
        {
            var spec = new CompositeSpecification<string, Error>(new List<ISpecification<string, Error>> { new AlwaysTrueSpec(), new AlwaysFalseSpec() });

            var result = spec.IsSatisfiedBy("test");

            Assert.False(result.IsSuccess);
        }

        private class AlwaysTrueSpec : ISpecification<string, Error>
        {
            public Result<Error> IsSatisfiedBy(string entity)
            {
                return Result<Error>.Success();                
            }
        }

        private class AlwaysFalseSpec : ISpecification<string, Error>
        {
            public Result<Error> IsSatisfiedBy(string entity)
            {
                return new Error("Always false");
            }
        }
    }


}
