using Sushi.MediaKiwi.Services.Entities;

namespace Sushi.MediaKiwi.DAL.UnitTests
{
    public class SectionTest
    {
        [Theory]
        [InlineData("myId", true)]
        [InlineData("123", true)]
        [InlineData("123myId", true)]
        [InlineData("", false)]
        [InlineData(null, false)]
        [InlineData("my id", false)]
        [InlineData("myId@", false)]
        [InlineData("123456789012345678901234567890123456789012345678901234567890toolongastring", false)]
        public void ValidateId(string? id, bool isValid)
        {
            // act
            var result = Section.ValidateSectionId(id);

            // Assert
            Assert.Equal(isValid, result == null);
        }
    }
}
