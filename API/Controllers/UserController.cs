using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class UserController: ControllerBase
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public UserController(SignInManager<AppUser> signInManager, 
            UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _mapper = mapper;
        }
        
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterUserDto userDto)
        {
            var newUser = new AppUser
            {
                UserName = userDto.Username,
                Email = userDto.Email
            };

            
            if(await _userManager.FindByNameAsync(newUser.UserName) != null) return BadRequest(new UserError("Ime je već zauzeto"));

            if(await _userManager.FindByEmailAsync(newUser.Email) != null) return BadRequest(new UserError("Email je već zauzet"));

            var result = await _userManager.CreateAsync(newUser, userDto.Password);
            
            if(!result.Succeeded) return BadRequest("Failed to create new user");



            return Ok(CreateUserDto(newUser));
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto userDto)
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if(user == null) return BadRequest(new UserError("Pogrešan email ili zaporka!"));

            var result = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);
            if(!result.Succeeded) return BadRequest(new UserError("Pogrešan email ili zaporka!"));

            return Ok(CreateUserDto(user));
        }

        
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if(user == null) return BadRequest("Could not retreve user profile");

            var profile = _mapper.Map<AppUser, Application.Profiles.Profile>(user);
            
            return Ok(profile);
        }

        [Authorize]
        [HttpPut("changePassword")]

        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if(user == null) return BadRequest("Could not retreve user profile");

            if(changePasswordDto.NewPassword != changePasswordDto.RepeatPassword) return BadRequest(new UserError("Ponovljena lozinka se na poklapa"));

            var result = await _signInManager.CheckPasswordSignInAsync(user, changePasswordDto.OldPassword, false );
            if(!result.Succeeded) return BadRequest(new UserError("Pogrešna stara lozinka"));

            var isChangedResult = await _userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            if(!isChangedResult.Succeeded) return BadRequest(new UserError("Newšto je pošlo po krivu"));

            return Ok();
        }
 

        private UserDto CreateUserDto(AppUser user)
        {
            var token = _tokenService.CreateToken(user);
            return new UserDto
            {
                Username = user.UserName,
                Email = user.Email,
                Token = token
            };
        }
    }
    
}