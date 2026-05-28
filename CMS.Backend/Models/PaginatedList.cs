namespace CMS.Backend.Models
{
    /// <summary>
    /// Generic pagination model cho danh sách các item
    /// </summary>
    public class PaginatedList<T>
    {
        public List<T> Items { get; set; } = new List<T>();

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalItems { get; set; }

        public bool HasPreviousPage => CurrentPage > 1;

        public bool HasNextPage => CurrentPage < TotalPages;

        public PaginatedList(List<T> items, int totalItems, int currentPage, int pageSize)
        {
            Items = items;
            TotalItems = totalItems;
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalPages = (int)Math.Ceiling((double)totalItems / pageSize);
        }

        /// <summary>
        /// L?y s? th? t? b?t ??u c?a item trên trang hi?n t?i
        /// </summary>
        public int StartIndex => (CurrentPage - 1) * PageSize + 1;

        /// <summary>
        /// L?y s? th? t? k?t thúc c?a item trên trang hi?n t?i
        /// </summary>
        public int EndIndex => Math.Min(StartIndex + PageSize - 1, TotalItems);
    }
}
