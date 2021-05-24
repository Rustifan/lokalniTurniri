
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Application.Images;
using System;

namespace API.Controllers
{
    public class PicturesController: BaseAPIController
    {
        [HttpPost]
        public async Task<IActionResult> PostPhoto([FromForm] IFormFile image)
        {
            
            return HandleResult(await Mediator.Send(new Add.Command{Image = image}));

        }

        [HttpDelete("{imageId}")]
        public async Task<IActionResult> DeletePhoto(Guid imageId)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{ImageId = imageId}));
        }

        [HttpPut("setAvatar/{imageId}")]
        public async Task<IActionResult> SetAvatar(Guid imageId)
        {
            return HandleResult(await Mediator.Send(new SetAvatar.Command{ImageId = imageId}));
        }
    }
}