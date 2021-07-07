using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
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
        private readonly IEmailSender _emailSender;
        public UserController(SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager, ITokenService tokenService,
            ILogger<UserController> logger, IGoogleLoginService googleLogin,
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _logger = logger;
            _googleLogin = googleLogin;
            _emailSender = emailSender;
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
            
            var sendEmailResult = await SendConfirmationEmail(newUser);

            if(!sendEmailResult) return Ok("Email nije poslan");


            return Ok();
        }



        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto userDto)
        {
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user == null) return BadRequest(new UserError("Pogrešan email ili zaporka!"));

            var result = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);


            if (!result.Succeeded) return BadRequest(new UserError("Pogrešan email ili zaporka!"));

            if (!user.EmailConfirmed) return BadRequest(UserError.EmailNotConfirmedError());


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
                    Avatar = result.Picture,
                    EmailConfirmed = true
                };

                var sucess = await _userManager.CreateAsync(newUser);
                if (!sucess.Succeeded) return BadRequest("Something went wrong while creating user");
                await AddRefreshToken(newUser);

                return Ok(CreateUserDto(newUser));
            }
            await AddRefreshToken(user);

            return Ok(CreateUserDto(user));
        }

        [AllowAnonymous]
        [HttpPost("forgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordObject)
        {
            string email = forgotPasswordObject.Email;

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Ok();

            await _userManager.UpdateSecurityStampAsync(user);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var urlEncodedToken = HttpUtility.UrlEncode(token);

            var origin = Request.Headers["origin"];

            var resetPasswordClientPath = $"{origin}/resetPassword/{user.UserName}/{urlEncodedToken}";
            var message = $@"
                <h1>Promjena lozinke</h1>
                <div>
                    Molim vas kliknite na
                    <a href={resetPasswordClientPath}>link</a> za promjenu vaše lozinke. 
                </div>
                ";

            try
            {
                await _emailSender.SendEmailAsync(email, "Promjena lozinke", message);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message);
            }

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("verifyPasswordToken")]
        public async Task<IActionResult> VerifyPasswordToken(VerifyPasswordTokenDto verifyPasswordTokenDto)
        {
            var username = verifyPasswordTokenDto.Username;
            var token = HttpUtility.UrlDecode(verifyPasswordTokenDto.Token);
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return BadRequest("Token nije valjan ili je istekao");

            var result = await _userManager.VerifyUserTokenAsync(
            user,
            _userManager.Options.Tokens.PasswordResetTokenProvider,
            "ResetPassword",
            token);

            if (result) return Ok();

            return BadRequest("Token nije valjan ili je istekao");
        }

        [AllowAnonymous]
        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByNameAsync(resetPasswordDto.Username);
            if (user is null) return BadRequest("Token je istekao ili nije valjan");

            var token = HttpUtility.UrlDecode(resetPasswordDto.Token);

            var result = await _userManager.ResetPasswordAsync(user, token, resetPasswordDto.Password);
            if (!result.Succeeded) return BadRequest("Token je istekao ili nije valjan");

            return Ok(CreateUserDto(user));
        }

        [AllowAnonymous]
        [HttpGet("resendConfirmationMail")]
        public async Task<IActionResult> ResendConfirmationEmail([FromQuery] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if(user is null) return BadRequest("Korisnik ne postoji");

            if(user.EmailConfirmed) return BadRequest("Email je već potvrđen");
            var sucess = await SendConfirmationEmail(user);
            if(!sucess) return BadRequest("Nešto je pošlo po krivu");
            
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
        {
            var user = await _userManager.FindByEmailAsync(confirmEmailDto.Email);
            if(user == null) return BadRequest("Token nije valjan ili je istekao");

            var token = HttpUtility.UrlDecode(confirmEmailDto.Token);

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if(!result.Succeeded) return BadRequest("Token nije valjan ili je istekao");
            
            await _userManager.UpdateSecurityStampAsync(user);

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
        private async Task<bool> SendConfirmationEmail(AppUser user)
        {
            await _userManager.UpdateSecurityStampAsync(user);
            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var urlEncodedToken = HttpUtility.UrlEncode(token);
            var path = $"{origin}/confirmEmail/{user.Email}/{urlEncodedToken}";
            var subject = "Potvrda email adrese";
            var message = $@"<h1>Potvrda Email adrese</h1>
                <div>Molimo vas da kliknete na
                    <a href={path}>link</a> za potvrdu vaše email adrese
                </div>  
            ";

            try
            {
                await _emailSender.SendEmailAsync(user.Email, subject, message);
                return true;

            }
            catch(Exception)
            {
                return false;
            }
        }

    }


}

