using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Tournaments;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    public class TournamentsController: BaseAPIController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> ListTournaments([FromQuery]TournamentLoadParams loadParams)
        {
            if(loadParams.MapMode)
            {
                return HandleResult(await Mediator.Send(new MapModeList.Query{LoadParams=loadParams}));
            }
            return HandlePaginatedList(await Mediator.Send(new List.Query{LoadParams=loadParams}));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> DetailsTournament(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id=id}));    
        }

        [HttpPost]
        public async Task<IActionResult> CreateTournament(Tournament tournament)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Tournament = tournament}));
        }

        [Authorize(Policy = "IsAdminRequirement")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTournament(Guid id, TournamentEditDto tournament)
        {
            
            return HandleResult(await Mediator.Send(new Edit.Command{Tournament = tournament, Id = id}));
        }

        [Authorize(Policy = "IsAdminRequirement")]
        [HttpDelete("{id}")]


        public async Task<IActionResult> DeleteTournament(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [Authorize(Policy = "IsHostRequirement")]
        [HttpPut("{id}/addAdmin")]
        public async Task<IActionResult> AddAdmin(Guid id, [FromQuery] string adminName)
        {
            return HandleResult(await Mediator.Send(new AddAdmin.Command{Id = id, AdminName= adminName}));
        }

        [Authorize(Policy = "IsHostRequirement")]
        [HttpPut("{id}/removeAdmin")]

        public async Task<IActionResult> RemoveAdmin(Guid id, [FromQuery] string adminName)
        {
            return HandleResult(await Mediator.Send(new RemoveAdmin.Command{Id=id, AdminName=adminName}));
        }        

        [HttpPut("{id}/participate")]
        public async Task<IActionResult> Participate(Guid id)
        {
            return HandleResult(await Mediator.Send(new Participate.Command{Id=id}));
        }

        [Authorize(Policy="IsAdminRequirement")]
        [HttpPut("{id}/addContestor")]
        public async Task<IActionResult> AddContestor(Guid id,[FromQuery] string name, [FromQuery]bool isGuest)
        {
            return HandleResult(await Mediator.Send(new AddContestor.Command{Id = id, Name=name, IsGuest=isGuest}));
        }

        [Authorize(Policy="IsAdminRequirement")]
        [HttpPut("{id}/closeApplications")]
        public async Task<IActionResult> CloseApplications(Guid id)
        {
            return HandleResult(await Mediator.Send(new CloseApplications.Command{Id=id}));
        }

        [Authorize(Policy="IsAdminRequirement")]
        [HttpPut("{id}/calculatePairs")]
        public async Task<IActionResult> CalculatePairs(Guid id)
        {
            return HandleResult(await Mediator.Send(new CalculatePairs.Command{Id=id}));
        }

        //Currently not in use.....
        [HttpGet("{id}/activeGames")]
        public async Task<IActionResult> GetActiveGames(Guid id)
        {
            return HandleResult(await Mediator.Send(new GetActiveGames.Query{Id=id}));
        }

        [Authorize(Policy="IsGameAdminRequirement")]
        [HttpPut("setGameResult/{gameId}")]
        public async Task<IActionResult> SetGameResult(Guid gameId, [FromQuery] int result)
        {
            return HandleResult(await Mediator.Send(new AddResultToActiveGame.Command{GameId=gameId, Result=result}));
        }
    }


}