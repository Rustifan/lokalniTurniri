using System.Threading.Tasks;
using Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.ImageUpload
{
    public class CloudinaryImageUploader : IImageUploader
    {
        private readonly Cloudinary _cloudinary;
        private readonly IConfiguration _config;
        private readonly ILogger<CloudinaryImageUploader> _logger;
        public CloudinaryImageUploader(IConfiguration config, ILogger<CloudinaryImageUploader> logger)
        {
            _logger = logger;
            _config = config;
            var cloudinaryConfig = _config.GetSection("Cloudinary");

            var account = new Account
            (
                cloudinaryConfig["CloudName"],
                cloudinaryConfig["ApiKey"],
                cloudinaryConfig["ApiSecret"]
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<Image> UploadImage(IFormFile image)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.Name, image.OpenReadStream()),
                Folder = "lokalniTurniri.UserPictures"
            };


            var result = await _cloudinary.UploadAsync(uploadParams);
            
            if (result.Error != null)
            {
                _logger.LogError(result.Error.Message);
                 return null;
            }

            var newImage = new Image
            {
                Url = result.SecureUri.AbsoluteUri,
                PublicId = result.PublicId
            };

            return newImage;


        }

        public async Task<string> DeleteImage(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deletionParams);

            return result.Result;

        }
    }
}