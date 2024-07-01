using Sushi.MediaKiwi.WebAPI.Sorting;

namespace Sushi.MediaKiwi.WebAPI.UnitTests.Sorting
{
    public class TestFake
    {
        public class TestFakeSortMap : SortMap<TestFake>
        {
            public TestFakeSortMap()
            {
                Add(x => x.Id);
                Add(x => x.Name);
            }
        }
        
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
