using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Application.Tournaments;

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
    }


}