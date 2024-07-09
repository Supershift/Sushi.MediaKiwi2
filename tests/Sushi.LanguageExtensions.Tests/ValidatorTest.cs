using Sushi.LanguageExtensions.Errors;
using Sushi.LanguageExtensions.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sushi.LanguageExtensions.Tests
{
    public class ValidatorTest
    {
        [Fact]
        public void ValidateVariable_Result()
        {
            string someVariable = "Hello world";
            
            var result = Validate.Value(someVariable).Required().MaxLength(5).Result();
            
            Assert.NotNull(result.Error);
            Assert.Single(result.Error);
            Assert.Equal("MaxLength", result.Error[0].ErrorCode);
            Assert.Equal(nameof(someVariable), result.Error[0].Field);  
        }

        [Fact]
        public void ValidateProperty_Result()
        {
            var someObject = new MyClass() { FirstName = "Olivander" };
            
            var result = Validate.Value(someObject.FirstName).Required().MaxLength(5).Result();
            
            Assert.NotNull(result.Error);            
            Assert.Equal("MaxLength", result.Error[0].ErrorCode);
            Assert.Equal("someObject.FirstName", result.Error[0].Field);
        }

        [Fact]
        public void ValidateSuccess_Result()
        {
            string someVariable = "Hello world";
            
            var result = Validate.Value(someVariable).Required().MaxLength(25).Result();
            
            Assert.Null(result.Error);            
        }

        [Fact]
        public void ValidateVariable_Throw()
        {
            string someVariable = "Hello world";
            var act = () => Validate.Value(someVariable).Required().MaxLength(5).Throw();
            var exception = Assert.Throws<ValidationException>(act);
            Assert.NotNull(exception.Error);
            Assert.NotEmpty(exception.Error);
        }

        [Fact]
        public void ValidateChaining()
        {
            string someVariable = "Hello world";
            var someObject = new MyClass() { FirstName = null };
            
            var result = Validate
                .Value(someVariable).Required().MaxLength(5)
                .Value(someObject.FirstName).Required().MaxLength(6)
                .Result();
            
            Assert.NotNull(result.Error);            
            Assert.Equal(2, result.Error.Count);
            Assert.Equal("MaxLength", result.Error[0].ErrorCode);
            Assert.Equal(nameof(someVariable), result.Error[0].Field);
            Assert.Equal("Required", result.Error[1].ErrorCode);
            Assert.Equal("someObject.FirstName", result.Error[1].Field);
        }

        [Fact]
        public void ValidateRegex_Success()
        {
            // Create a pattern for a word that starts with the letter "M"
            string pattern = @"\b[M]\w+";
            var regex = new Regex(pattern);
            string someVariable = "Mastermind";

            var result = Validate.Value(someVariable).Regex(regex).Result();

            Assert.Null(result.Error);
        }

        [Fact]
        public void ValidateRegex_Empty_Success()
        {
            // Create a pattern for a word that starts with the letter "M"
            string pattern = @"\b[M]\w+";
            var regex = new Regex(pattern);
            string someVariable = "";

            var result = Validate.Value(someVariable).Regex(regex).Result();

            Assert.Null(result.Error);
        }

        [Fact]
        public void ValidateRegex_Invalid()
        {
            // Create a pattern for a word that starts with the letter "M"
            string pattern = @"\b[M]\w+";
            var regex = new Regex(pattern);
            string someVariable = "Kevin";

            var result = Validate.Value(someVariable).Regex(regex).Result();

            Assert.NotNull(result.Error);
            Assert.Single(result.Error);
            Assert.Equal("Regex", result.Error[0].ErrorCode);            
        }

        private record MyClass
        {
            public required string? FirstName { get; init; }
        }
    }
}
