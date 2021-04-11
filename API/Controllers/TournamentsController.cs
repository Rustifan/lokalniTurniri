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
        [HttpGet]
        public async Task<IActionResult> ListTournaments()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

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

        [Authorize(Policy = "IsHostRequirement")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTournament(Guid id, TournamentEditDto tournament)
        {
            return HandleResult(await Mediator.Send(new Edit.Command{Tournament = tournament, Id = id}));
        }

        [Authorize(Policy = "IsHostRequirement")]
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

    }


}