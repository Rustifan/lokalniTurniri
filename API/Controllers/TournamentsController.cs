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
    }


}