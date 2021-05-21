using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IImageUploader
    {
        Task<Image> UploadImage(IFormFile image);
        Task<string> DeleteImage(string publicId);
    }
}