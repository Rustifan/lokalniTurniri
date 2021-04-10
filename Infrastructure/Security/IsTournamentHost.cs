using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement: IAuthorizationRequirement
    {

    }
    public class IsTournamentHost : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsTournamentHost(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }
        
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var request = _httpContextAccessor.HttpContext.Request;

            var username = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);       
            var tournamentId = Guid.Parse(request.RouteValues.GetValueOrDefault("id").ToString());
            

            var tournament = await _context.Tournaments
                .Include(x=>x.Host)
                .FirstOrDefaultAsync(x=>x.Id==tournamentId);
            if(tournament==null)return;

            if(tournament.Host.UserName != username) return;
            

            context.Succeed(requirement);



        }
    }
}