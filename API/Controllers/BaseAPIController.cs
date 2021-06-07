using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using API.Extension;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;


namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class BaseAPIController: ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<IMediator>();

        protected IActionResult HandleResult<T> (Result<T> result)
        {
            if(result == null) return NotFound();
            else if(result.IsSucess) return Ok(result.Value);
            else if(!result.IsSucess) return BadRequest(result.Error);
            return BadRequest();

        }

        public IActionResult HandlePaginatedList<T>(PaginatedList<T> paginatedList)
        {
            if(paginatedList == null) return NotFound();

            var paginationHeader = new 
            {
                currentPage = paginatedList.CurrentPage,
                itemsPerPage = paginatedList.ItemsPerPage,
                numberOfPages = paginatedList.NumberOfPages,
                totalItemCount = paginatedList.TotalItemCount
            };
            var serializedPagination = JsonSerializer.Serialize(paginationHeader);
            HttpContext.Response.AddHeaders("pagination", serializedPagination);
            
            return Ok(paginatedList.ToList());
        }
    }
}