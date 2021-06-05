namespace Application.Tournaments
{
    public class PageParams
    {
        private const int MAX_ITEMS_PER_PAGE = 50;
        public int CurrentPage { get; set; } = 1;
        private int _itemsPerPage = 2;
        public int ItemsPerPage
        {
            get => _itemsPerPage;
            set => _itemsPerPage = value <= MAX_ITEMS_PER_PAGE ? value : MAX_ITEMS_PER_PAGE;
        }
        
    }
}