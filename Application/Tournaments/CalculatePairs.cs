using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
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
        public class Command: IRequest<Result<TournamentDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<TournamentDto>>
        {
            private readonly List<Game> _games = new(); 
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly ISorter _sorter;
            public Handler(DataContext context, IMapper mapper, ISorter sorter)
            {
                _context = context;
                _mapper = mapper;
                _sorter = sorter;
            }
            public async Task<Result<TournamentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var tournament = await _context.Tournaments
                    .Include(x=>x.Games)
                    .Include(x=>x.Contestors)
                    .FirstOrDefaultAsync(x=>x.Id == request.Id, cancellationToken);

                if(tournament == null) return null;

                if(!tournament.ApplicationsClosed) return Result<TournamentDto>.Failed("Tournament applications are not closed");
                
                if(tournament.CurrentRound >= tournament.NumberOfRounds) return Result<TournamentDto>.Failed("Tournament is over"); 
                //if there are active games Bad request
                if(tournament.Games.Any(x=>x.Result == -1)) return Result<TournamentDto>.Failed("There are still active games left");
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
                tournament.CurrentRound++;
                var loners = new List<Contestor>();
                

                foreach(float score in scores)
                {
                    var contestorsWithSameScore = contestorMap[score].OrderBy(x=>x.Rating).ToList();
                    //create list vith loners first and new contestors
                    var contestorList = new List<Contestor>(loners);
                    contestorList.AddRange(contestorsWithSameScore);
                    loners = new List<Contestor>();

                    

                    AddActiveGames(contestorList, tournament, loners);
                    
                }

                if(loners.Count > 0)
                {
                    //TODO
                    return Result<TournamentDto>.Failed("Loners Error ");
                }
                



                ////////////////////disable for testing////////////////////////////////////////
                var result = await _context.SaveChangesAsync(cancellationToken) > 0;
                if(!result) return Result<TournamentDto>.Failed("Something went wrong while saving to database");
                
                var tournamentDto = _mapper.Map<TournamentDto>(tournament);
                tournamentDto.Contestors = _sorter.SortContestorDtos(tournamentDto.Contestors);

                return Result<TournamentDto>.Success(tournamentDto);
                    
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
                            
                            contestorMap[scores[i]].Remove(contestor);
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

            private void AddActiveGames(List<Contestor> contestors, Tournament tournament, List<Contestor> loners)
            {
                
                if(contestors.Count == 1)
                {
                    loners.Add(contestors[0]);
                    return;
                }
                if(contestors.Count == 0) return;
                SplitListInTwo(contestors, out List<Contestor> list1, out List<Contestor> list2);
                
                for(int i = 0; i < list1.Count; i++)
                {
                    for(int j = 0; j < list2.Count; j++)
                    {
                        var contestor1 = list1[i];
                        var contestor2 = list2[j];
                        if(HasPlayedTogether(contestor1, contestor2))
                        {
                            if(ChangeWithPreviousGames(contestor1, contestor2, tournament))
                            {
                                list1.Remove(contestor1);
                                list2.Remove(contestor2);
                                i--;
                                break;
                            }
                            continue;
                        }

                        var game = new Game
                        {
                            Contestor1 = contestor1,
                            Contestor2 = contestor2,
                            Tournament = tournament,
                            Round = tournament.CurrentRound,
                            Result = -1
                        };
                        _games.Add(game);

                        contestor1.PlayedContestors.Add(contestor2.DisplayName);
                        contestor2.PlayedContestors.Add(contestor1.DisplayName);

                        tournament.Games.Add(game);
                        list1.Remove(contestor1);
                        list2.Remove(contestor2);
                        i--;
                        break;
                    }
                }
                AddActiveGames(list1, tournament, loners);
                AddActiveGames(list2, tournament, loners);

            }

            public static void SplitListInTwo(List<Contestor> list, out List<Contestor> list1, out List<Contestor> list2)
            {
                list1 = new List<Contestor>();
                list2 = new List<Contestor>();
                var halfOfList = (int)Math.Ceiling(list.Count/2.0f);

                for(int i = 0; i < list.Count; i++)
                {
                    if(i < halfOfList) list1.Add(list[i]);
                    else list2.Add(list[i]);    
                }
            }

            public static bool HasPlayedTogether(Contestor contestor1, Contestor contestor2)
            {
                foreach(var playedName in contestor1.PlayedContestors)
                {
                    if(playedName == contestor2.DisplayName)
                    {
                        return true;
                    }
                }
                
                return false;

            }

            private bool ChangeWithPreviousGames(Contestor contestor1, Contestor contestor2, Tournament tournament)
            {
                
                void SwapWithGame(Contestor contestor1, Contestor contestor2, Game game)
                {
                    game.Contestor1.PlayedContestors.RemoveAt(game.Contestor1.PlayedContestors.Count-1);
                    game.Contestor2.PlayedContestors.RemoveAt(game.Contestor2.PlayedContestors.Count-1);

                    var swapGame = new Game
                    {
                        Contestor1 = game.Contestor2,
                        Contestor2 = contestor2,
                        Tournament = tournament,
                        Result = -1,
                        Round = tournament.CurrentRound
                    };
                    game.Contestor2 = contestor1;

                    game.Contestor1.PlayedContestors.Add(game.Contestor2.DisplayName);
                    game.Contestor2.PlayedContestors.Add(game.Contestor1.DisplayName);
                    
                    swapGame.Contestor1.PlayedContestors.Add(swapGame.Contestor2.DisplayName);
                    swapGame.Contestor2.PlayedContestors.Add(swapGame.Contestor1.DisplayName);

                    _games.Add(swapGame);
                    tournament.Games.Add(swapGame);
                }


                for(int i = _games.Count-1; i >= 0; i--)
                {
                    var game = _games[i];
                    if(!HasPlayedTogether(contestor1, game.Contestor1) && !HasPlayedTogether(contestor2, game.Contestor2))
                    {
                        SwapWithGame(contestor1, contestor2, game);
                        return true;
                    }

                    if(!HasPlayedTogether(contestor1, game.Contestor2) && !HasPlayedTogether(contestor2, game.Contestor1))
                    {
                        SwapWithGame(contestor2, contestor1, game);
                        return true;
                    }
                }

                return false;
            }
        }


    }
}