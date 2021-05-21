using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Images;


namespace API.Controllers
{
    public class PicturesController: BaseAPIController
    {
        [HttpPost]
        public async Task<IActionResult> PostPhoto([FromForm] IFormFile image)
        {
            
            return HandleResult(await Mediator.Send(new Add.Command{Image = image}));

        }
    }
}