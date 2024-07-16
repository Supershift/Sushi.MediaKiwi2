using Sushi.LanguageExtensions.Errors;

namespace Sushi.LanguageExtensions.Tests
{
    public class ResultTest
    {
        [Fact]
        public void CreateSuccess()
        {
            var result = Result.Success<Error>();

            Assert.True(result.IsSuccess);
            Assert.Null(result.Error);
        }

        [Fact]
        public void CreateError()
        {
            var error = new Error("Test");
            var result = new Result<Error>(error);

            Assert.False(result.IsSuccess);
            Assert.Equal(error, result.Error);
        }

        [Fact]
        public void ImplicitlyConvertValueToResult()
        {
            var value = new MyTestClass();

            Result<MyTestClass, Error> result = value;

            Assert.True(result.IsSuccess);
            Assert.Null(result.Error);
            Assert.Equal(value, result.Value);
        }

        [Fact]
        public void ImplicitlyConvertErrorToResult()
        {
            var error = new Error("Test");

            Result<MyTestClass, Error> result = error;

            Assert.False(result.IsSuccess);
            Assert.Equal(error, result.Error);
        }

        private class MyTestClass
        {
            public string? MyProperty { get; set; }
        }
    }
}