using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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
    }
}