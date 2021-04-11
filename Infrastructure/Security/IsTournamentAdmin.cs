using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsTournamentAdminReqirement: IAuthorizationRequirement
    {

    }

    public class IsTournamentAdminHandler : AuthorizationHandler<IsTournamentAdminReqirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;
        public IsTournamentAdminHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsTournamentAdminReqirement requirement)
        {
            var request = _httpContextAccessor.HttpContext.Request;
            
            var tournamentId = Guid.Parse(request.RouteValues.GetValueOrDefault("id")?.ToString());
            

            var tournament = await _context.Tournaments
                .Include(x=>x.Admins)
                .ThenInclude(x=>x.User)
                .FirstOrDefaultAsync(x=>x.Id == tournamentId);
            
            if(tournament == null) return;

            var userName = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);
            if(userName == null) return;

            if(tournament.Admins.Any(x=>x.User.UserName == userName))
            {
                context.Succeed(requirement);
            }

            


        }
    }
}