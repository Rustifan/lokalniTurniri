using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    public class BuggyController: BaseAPIController
    {   
        [AllowAnonymous]
        [HttpGet("notFound")]

        public IActionResult NotFoundRoute()
        {
           return NotFound();
        }

        [AllowAnonymous]
        [HttpGet("badRequest")]

        public IActionResult BadRequestRoute()
        {
            return BadRequest("Nešto si zajeba");
        }

        [HttpGet("unauthorized")]
        public IActionResult UnAuthoriszdRoute()
        {
            return Unauthorized("Zabranjeno");
        }

        [AllowAnonymous]
        [HttpGet("serverError")]
        public IActionResult ServerErrorRoute()
        {
            throw(new Exception("Errori na sve strane"));

            
        }
    }
}