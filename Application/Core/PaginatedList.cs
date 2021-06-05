using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PaginatedList<T>: List<T>
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int NumberOfPages { get; set; }
        public int TotalItemCount { get; set; }

        public PaginatedList (IEnumerable<T> list, int currentPage, int itemsPerPage, int totalItemCount)
        {
            AddRange(list);
            CurrentPage = currentPage;
            ItemsPerPage = itemsPerPage;
            NumberOfPages = totalItemCount % itemsPerPage == 0 ? 
                totalItemCount / itemsPerPage : 
                (totalItemCount / itemsPerPage) + 1;
            TotalItemCount = totalItemCount;
            
        }
        public static async Task<PaginatedList<T>> ToPaginatedListAsync(IQueryable<T> query, int currentPage, int itemsPerPage)
        {
            var totalItemCount = await query.CountAsync();
           
            var list = await query
                .Skip((currentPage-1)*itemsPerPage)
                .Take(itemsPerPage)
                .ToArrayAsync();

            return new PaginatedList<T>(list, currentPage, itemsPerPage, totalItemCount);
            
        }
    }
}