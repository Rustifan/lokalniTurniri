using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Application.Profiles;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class UserProfilesController: BaseAPIController
    {
        
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> List()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [AllowAnonymous]
        [HttpGet("{username}")]
        public async Task<IActionResult> Details(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Username = username}));
        }
    }
}