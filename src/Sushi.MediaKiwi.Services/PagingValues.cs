namespace Sushi.MediaKiwi.Services
{
    /// <summary>
    /// Represents values used when paging datasets.
    /// </summary>
    public record PagingValues
    {
        /// <summary>
        /// Gets a <see cref="PagingValues"/> instance with default values (pagesize = 10, index = 0).
        /// </summary>
        public static readonly PagingValues Default = new PagingValues(0, 10);

        /// <summary>
        /// Creates a new instance of <see cref="PagingValues"/>.
        /// </summary>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        public PagingValues(int pageIndex, int pageSize)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
        }

        /// <summary>
        /// Gets the request zero based index.
        /// </summary>
        public int PageIndex { get; }

        /// <summary>
        /// Gets the number of items per page.
        /// </summary>
        public int PageSize { get; }
    }
}
