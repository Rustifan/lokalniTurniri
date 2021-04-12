using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


//TODO Must not reapeat
//black and white

namespace Application.Tournaments
{
    public class CalculatePairs
    {
        public class Command: IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .Include(x=>x.Games)
                    .Include(x=>x.Contestors)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);

                if(tournament == null) return null;

                if(!tournament.ApplicationsClosed) return Result<Unit>.Failed("Tournament applications are not closed");
                
                //if there are active games Bad request
                if(tournament.Games.Any(x=>x.Result == -1)) return Result<Unit>.Failed("There are still active games left");
                //random rating always

                var contestors = tournament.Contestors;
                if(tournament.CurrentRound == 0) AssignRandomRating(contestors);
               
                //create Map of scores
                var contestorMap = new Dictionary<float, List<Contestor>>();
                foreach(var contestor in contestors)
                {
                    if(contestorMap.ContainsKey(contestor.Score) == false) contestorMap.Add(contestor.Score, new List<Contestor>());
                    contestorMap[contestor.Score].Add(contestor);
                    
                }
                //scores sorted
                var scores = contestorMap.Keys.OrderByDescending(x=>x).ToList();
                
                //find pausing contestor
                if(contestors.Count % 2 !=0)
                {
                    AssignAndRemovePausingContestor(contestorMap, scores);
                }

                //calculate Pairs
                Contestor loner = null;
                foreach(float score in scores)
                {
                    var contestorList = loner == null ? new List<Contestor>() : new List<Contestor>{loner}; 
                    var contestorsWithSameScore = contestorMap[score].OrderBy(x=>x.Rating).ToList();
                    contestorList.AddRange(contestorsWithSameScore);

                    if(contestorList.Count % 2 != 0)
                    {
                        loner = contestorList[^1];
                        contestorList.Remove(loner);

                    }
                    else
                    {
                        loner = null;
                    }

                    AddActiveGames(contestorList, tournament);
                    
                }
                



                
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<Unit>.Failed("Something went wrong while saving to database");
                return Result<Unit>.Success(Unit.Value);
                    
            }

            private static void AssignAndRemovePausingContestor(Dictionary<float, List<Contestor>> contestorMap, List<float> scores)
            {
                // breaks if there are more round than contestors. Contestor number must be higher.
                for(int i = scores.Count-1; i>=0; i--)
                {
                    bool found = false;
                    var contestorList = contestorMap[scores[i]].OrderBy(x=>x.Rating).ToList();
                    for(int j = contestorList.Count-1; j>=0; j--)
                    {
                        var contestor = contestorList[j];
                        if(!contestor.RoundPaused)
                        {
                            contestor.RoundPaused = true;
                            contestor.Wins++;
                            contestorList.Remove(contestor);
                            found = true;
                            break;
                        } 
                    }

                    if(found) break;
                }
            }
            private static void AssignRandomRating(ICollection<Contestor> contestors)
            {
                var ratings = new List<int>();
                for(int i = 1; i < contestors.Count+1; i++)
                {
                    ratings.Add(i); 
                };

                var rand = new Random();

                foreach(var contestor in contestors)
                {
                    var ratingIndex = rand.Next(ratings.Count);

                    var rating = ratings[ratingIndex];

                    contestor.Rating = rating;

                    ratings.Remove(rating);
                }
            }

            private static void AddActiveGames(List<Contestor> contestors, Tournament tournament)
            {
                for(int i = 0; i < contestors.Count/2; i++)
                {
                    var contestor1 = contestors[i];
                    var contestor2 = contestors[i+contestors.Count/2];
                    var game = new Game
                    {
                        Contestor1 = contestor1,
                        Contestor2 = contestor2,
                        Tournament = tournament,
                        Result = -1
                    };
                    tournament.Games.Add(game);
                }
                tournament.CurrentRound++;
            }
        }


    }
}