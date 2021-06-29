using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using Application.Interfaces;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {

        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly ILogger<UserController> _logger;
        private readonly IGoogleLoginService _googleLogin;
        public UserController(SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager, ITokenService tokenService,
            ILogger<UserController> logger, IGoogleLoginService googleLogin)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _logger = logger;
            _googleLogin = googleLogin;
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


            if (await _userManager.FindByNameAsync(newUser.UserName) != null) return BadRequest(new UserError("Ime je već zauzeto"));

            if (await _userManager.FindByEmailAsync(newUser.Email) != null) return BadRequest(new UserError("Email je već zauzet"));

            var result = await _userManager.CreateAsync(newUser, userDto.Password);

            if (!result.Succeeded) return BadRequest("Failed to create new user");


            await AddRefreshToken(newUser);
            return Ok(CreateUserDto(newUser));
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto userDto)
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user == null) return BadRequest(new UserError("Pogrešan email ili zaporka!"));

            var result = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);
            if (!result.Succeeded) return BadRequest(new UserError("Pogrešan email ili zaporka!"));



            await AddRefreshToken(user);
            return Ok(CreateUserDto(user));
        }


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (user == null) return BadRequest("Could not retreve user profile");


            await AddRefreshToken(user);


            return Ok(CreateUserDto(user));
        }

        [Authorize]
        [HttpPut("changePassword")]

        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (user == null) return BadRequest("Could not retreve user profile");

            if (changePasswordDto.NewPassword != changePasswordDto.RepeatPassword) return BadRequest(new UserError("Ponovljena lozinka se na poklapa"));

            var result = await _signInManager.CheckPasswordSignInAsync(user, changePasswordDto.OldPassword, false);
            if (!result.Succeeded) return BadRequest(new UserError("Pogrešna stara lozinka"));

            var isChangedResult = await _userManager.ChangePasswordAsync(user, changePasswordDto.OldPassword, changePasswordDto.NewPassword);
            if (!isChangedResult.Succeeded) return BadRequest(new UserError("Newšto je pošlo po krivu"));

            return Ok();
        }

        [Authorize]
        [HttpGet("{refreshToken}")]
        public async Task<IActionResult> RefreshToken()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var user = await _userManager.Users
                .Include(x => x.RefreshTokens)
                .FirstOrDefaultAsync(x => x.UserName == username);
            if (user == null) return Unauthorized();

            var tokenFromCookie = Request.Cookies["refreshToken"];
            if (tokenFromCookie == null) return Unauthorized();

            var refreshToken = user.RefreshTokens.FirstOrDefault(x => x.Token == tokenFromCookie);
            if (refreshToken == null || !refreshToken.IsActive) return Unauthorized();

            refreshToken.Revoked = true;
            user.RefreshTokens.Remove(refreshToken);

            await AddRefreshToken(user);

            return Ok(CreateUserDto(user));
        }

        [AllowAnonymous]
        [HttpPost("googleLogin")]

        public async Task<IActionResult> GoogleLogin(GoogleLoginDto googleLogin)
        {
            _logger.LogInformation("validating google tokenId");
            var result = await _googleLogin.ValidateToken(googleLogin.TokenId);
            if (!result.IsSucess) return BadRequest(result.Error);

            var email = result.Email;
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null)
            {
                var newUser = new AppUser
                {
                    UserName = result.Username,
                    Email = result.Email,
                    Avatar = result.Picture
                };

                var sucess = await _userManager.CreateAsync(newUser);
                if (!sucess.Succeeded) return BadRequest("Something went wrong while creating user");
                await AddRefreshToken(newUser);

                return Ok(CreateUserDto(newUser));
            }
            await AddRefreshToken(user);

            return Ok(CreateUserDto(user));
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


        private async Task AddRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.CreateRefreshToken();

            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.Now.AddDays(7),
                IsEssential = true,
                SameSite = SameSiteMode.None,
                Secure = true

            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }
    }

}

