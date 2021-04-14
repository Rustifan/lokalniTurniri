using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;
using System.Linq;
using System;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Security
{
    public class IsGameTournamentAdminRequirement : IAuthorizationRequirement
    {

    }

    public class IsGameTournamentAdminHandler : AuthorizationHandler<IsGameTournamentAdminRequirement>
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsGameTournamentAdminHandler(DataContext context, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;

        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsGameTournamentAdminRequirement requirement)
        {
            var request = _httpContextAccessor.HttpContext.Request;
            var username = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            if(username == null) return;

            var gameId = Guid.Parse(request.RouteValues["gameId"]?.ToString());
            if(gameId == null) return;

            var game = await _context.Games
                .Include(x=>x.Tournament)
                .ThenInclude(x=>x.Admins)
                .ThenInclude(x=>x.User)
                .FirstOrDefaultAsync(x=>x.Id == gameId);
            if(game == null) return;
            var tournament = game.Tournament;

            if(tournament.Admins.Any(x=>x.User.UserName == username))
            {
                context.Succeed(requirement);
            }

            
            

        }
    }
}