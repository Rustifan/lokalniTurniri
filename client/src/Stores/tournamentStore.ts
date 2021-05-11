import {makeAutoObservable, runInAction} from "mobx";
import { agent } from "../App/agent";
import { TournamentFormValues, Tournament } from "../App/Interfaces/Tournament";
import { store } from "./store";
import {v4 as uuid} from "uuid"
import { history } from "..";
import { Contestor } from "../App/Interfaces/Contestor";
import { AddContestor } from "../App/Interfaces/AddContestor";
import { Game } from "../App/Interfaces/Game";
export class TournamentStore
{
    tournamentMap = new Map<string, Tournament>();    
    selectedTournament: Tournament | undefined = undefined;
    addContestorModalOpen = false;
    addAdminModalOpen = false;    
    removeAdminModalOpen = false;
    setGameResultModalOpen: string | null = null;
    setResultLoading: number | null = null;
    //loading
    tournamentLoading = false;
    creatingTournament = false;   
    editingTournament = false; 
    participateLoading = false;    
    closeApplicationsLoading = false;


    constructor()
    {
        makeAutoObservable(this);
    }

    loadTournaments = async ()=>
    {
        this.tournamentLoading = true;
        try
        {
            const tournaments = await agent.Tournaments.get();
            
            tournaments.forEach(tournament=>
            {
                
                this.addToTournamentMap(tournament);
            });
            
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                
                this.tournamentLoading = false;
            });
        }
    }

    addToTournamentMap = (tournament: Tournament) =>
    {
        tournament.date = new Date(tournament.date);
        runInAction(()=>
        {
            this.tournamentMap.set(tournament.id, tournament);

        })
    }
    
    get tournamentList()
    {
        return Array.from(this.tournamentMap.values());
    }

    selectTornament = async (id: string)=>
    {
        this.tournamentLoading = true;
        let tournament = this.tournamentMap.get(id);
        if(!tournament)
        {
            try
            {
                tournament = await agent.Tournaments.details(id);
                tournament.date = new Date(tournament.date);
            }
            catch(err)
            {
                console.log(err);
            }
            
        }
                  
        
        runInAction(()=>
        {
                this.selectedTournament = tournament; 

                this.tournamentLoading = false;
        });

       
        
    }

    createTournament = async (createdTournament: TournamentFormValues)=>
    {
        this.creatingTournament = true;
        const id = uuid();
        createdTournament.id = id;
        try
        {
            await agent.Tournaments.create(createdTournament);
            if(this.ifLoaded())
            {
               const tournament = new Tournament(createdTournament);
               this.addToTournamentMap(tournament);
        
            }
            runInAction(()=>this.creatingTournament === false);

            history.push("/tournaments/"+createdTournament.id);
        }
        catch(err)
        {
            runInAction(()=>this.creatingTournament === false);

            console.log(err);
        }
        
    }

    editTournament = async (tournamentForm: TournamentFormValues)=>
    {
        this.editingTournament = true;
        const tournament = this.selectedTournament;
        try
        {
            await agent.Tournaments.edit(tournamentForm);
            if(tournament !== undefined)
            {
                runInAction(()=>
                {
                    tournament.name = tournamentForm.name;
                    tournament.sport = tournamentForm.sport;
                    tournament.numberOfRounds = tournamentForm.numberOfRounds;
                    tournament.location = tournamentForm.location;
                    tournament.date = tournamentForm.date;
                })
            }
            if(tournamentForm.id) history.push("/tournaments/"+tournamentForm.id);

        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.editingTournament=false);
        }
    }

    deleteTournament = async (id: string)=>
    {
        this.tournamentLoading = true;
        try
        {   
            await agent.Tournaments.delete(id);
            this.tournamentMap.delete(id);
            history.push("/tournaments");
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.tournamentLoading=false);
        }
    }

    deselectTournament = ()=>
    {
        this.selectedTournament = undefined;
    }

    isAdmin = ()=>
    {
        if(!this.selectedTournament || !store.userStore.user) return false;

        const admins = this.selectedTournament.admins;
        const user = store.userStore.user;
        for(const admin of admins)
        {
            if(user.username === admin) return true;
        }
        return false;
    }

    ifLoaded = ()=>
    {
       
        return this.tournamentMap.size !== 0;
    }

    isContestor = ()=>
    {
        if(!this.selectedTournament) return false;
        if(!store.userStore.user) return false;

        const user =  this.selectedTournament.contestors.find(x=>x.username === store.userStore.user?.username);
        if(user) return true;

        return false;

    }

    isHost=()=>
    {
        if(!this.selectedTournament || !store.userStore.user) return false;

        if(this.selectedTournament.hostUsername === store.userStore.user.username) return true;

        return false;
    }

    isContestorByName = (displayName: string)=>
    {
        if(!this.selectedTournament) return false;
        const user = this.selectedTournament.contestors.find(x=>x.displayName.toLowerCase() === displayName.toLowerCase());

        if(user) return true;

        return false;
    }

    participate = async (id: string)=>
    {
        this.participateLoading = true;
        try
        {   
            await agent.Tournaments.participate(id);
            if(this.isContestor())
            {
                runInAction(()=>
                {
                    this.selectedTournament!.contestors = 
                    this.selectedTournament!.contestors.filter(x=>x.username !== store.userStore.user?.username);
                })
            }
            else if(this.selectedTournament && store.userStore.user)
            {
                runInAction(()=>
                {
                    const user = store.userStore.user;
                    const contestor = new Contestor(user!.username, user?.username)
                    
                    this.selectedTournament?.contestors.push(contestor);
                })
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.participateLoading = false);
        }
    }

    setAddContestorModalOpen = (open: boolean)=>
    {
        this.addContestorModalOpen = open;
    }

    addContestor = async (values: AddContestor)=>
    {
        if(this.isContestorByName(values.name))
        {
            this.setAddContestorModalOpen(false);
            return store.errorStore.setError({head: "Već postoji natjecatelj sa tim imenom", statusCode: 400});
        }

        if(!this.selectedTournament) return;

        this.participateLoading = true;
        try
        {

            await agent.Tournaments.addContestor(this.selectedTournament.id, values.name, values.isGuest);
            if(this.selectedTournament)
            {
                const tournament = this.selectedTournament;
                const contestor = new Contestor(values.name, values.isGuest ? null: values.name);
                runInAction(()=>
                {
                    tournament.contestors.push(contestor);
                    tournament.contestorNum++;

                })
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.participateLoading = false;
                this.setAddContestorModalOpen(false);
            });
            
        }
    }

    removeContestor = async (values: AddContestor)=>
    {
        this.participateLoading = true;
        if(!this.isContestorByName(values.name))
        {
            this.setAddContestorModalOpen(false);
            return store.errorStore.setError({head: "Natjecatelj nije na popisu", statusCode: 400});
        }

        if(!this.selectedTournament) return;

        try
        {

            await agent.Tournaments.addContestor(this.selectedTournament.id, values.name, values.isGuest);
            if(this.selectedTournament)
            {
                this.selectedTournament.contestors = this.selectedTournament.contestors.filter(x=>x.displayName !== values.name);
                this.selectedTournament.contestorNum--;
            }
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.participateLoading = false;
            });
            
        }

    }

    closeApplications = async ()=>
    {
        if(!this.selectTornament) return;
        this.closeApplicationsLoading = true;

        try
        {
            await agent.Tournaments.closeApplications(this.selectedTournament?.id!);
            runInAction(()=>
            {
                this.selectedTournament!.applicationsClosed = !this.selectedTournament!.applicationsClosed;
            })
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.closeApplicationsLoading=false);
        }

    }

    addAdmin = async (adminName: string)=>
    {
        if(!this.selectedTournament) return;

        this.editingTournament = true;

        try
        {
            await agent.Tournaments.addAdmin(this.selectedTournament.id, adminName);
            this.selectedTournament.admins.push(adminName);
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.editingTournament = false;
                this.setAddAdminModalOpen(false);   
            })
        }


    }
    
    setAddAdminModalOpen = (open: boolean)=>
    {
        this.addAdminModalOpen = open;

    }

    setRemoveAdminModalOpen = (open: boolean)=>
    {
        this.removeAdminModalOpen = open;
    }  
    
    setSetGameResultModalOpen = (openId: string | null)=>
    {
        this.setGameResultModalOpen = openId;
    }    

    removeAdmin = async (adminName: string)=>
    {
        if(!this.selectedTournament) return;
        this.editingTournament = true;
        try
        {
            await agent.Tournaments.removeAdmin(this.selectedTournament.id, adminName);
            runInAction(()=>
            {
                this.selectedTournament!.admins = 
                this.selectedTournament!.admins.filter(x=>x!==adminName);
            })
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.editingTournament = false)
            this.setRemoveAdminModalOpen(false);
        }
    }

    calculatePairs = async ()=>
    {
        if(!this.selectedTournament) return;
        const tournament = this.selectedTournament;
        this.editingTournament = true;
        try
        {
            const updatedTournament = await agent.Tournaments.calculatePairs(tournament.id);


            runInAction(()=>
            {
                if(this.ifLoaded())
                {
                    this.addToTournamentMap(updatedTournament);
                    this.selectedTournament = this.tournamentMap.get(tournament.id);
                }
                else
                {
                    updatedTournament.date = new Date(updatedTournament.date);
                    this.selectedTournament = updatedTournament;
                    
                }
            });

        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.editingTournament=false);
        }


    }

    get gamesByRound()
    {
        if(!this.selectedTournament) return [];
        const gamesByRoundArray: Game[][] = [];
        for(let i = 0; i <= this.selectedTournament.currentRound; i++)
        {
            gamesByRoundArray.push([]);
        }

        for(const game of this.selectedTournament.games)
        {
            gamesByRoundArray[game.round].push(game);    
        }

        return gamesByRoundArray;

    }

    get hasActiveGames()
    {
        if(!this.selectedTournament) return false;
        for(let game of this.selectedTournament.games)
        {
            if(game.active) return true;
        }
        return false;
    }

    setGameResult = async (gameId: string, result: number)=>
    {
        if(!this.selectedTournament) return;
        this.setResultLoading = result;
        try
        {
            await agent.Tournaments.setGameResult(gameId, result);
            runInAction(()=>
            {
                this.selectedTournament!.games = this.selectedTournament!.games.map(game=>
                    {
                        if(game.id === gameId)
                        {
                            const previousResult = game.result;
                            game.result = result;
                            game.active = false;
                            this.updateTournamentTable(game, previousResult);
                        }
                        return game;
                    });
            })


        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>
            {
                this.setResultLoading = null;
                this.setSetGameResultModalOpen(null);
            });
        }

        
    }

    updateTournamentTable = (game: Game, previosResult: number)=>
    {
        if(!this.selectedTournament) return;
        const tournament = this.selectedTournament;
        const contestor1 = tournament.contestors.find(x=>x.displayName === game.contestor1);
        const contestor2 = tournament.contestors.find(x=>x.displayName === game.contestor2);
        
        switch(previosResult)
        {
            case -1:
                break;
            case 0:
                contestor1!.draws--;
                contestor2!.draws--;
                break;
            case 1:
                contestor1!.wins--;
                contestor2!.loses--;
                break;
            case 2:
                contestor1!.loses--;
                contestor2!.wins--;
                break;
        }
        
        switch(game.result)
        {
            case 0:
                contestor1!.draws++;
                contestor2!.draws++;
                break;
            case 1:
                contestor1!.wins++;
                contestor2!.loses++;
                break;
            case 2:
                contestor1!.loses++;
                contestor2!.wins++;
                break;
        }

        contestor1!.score = contestor1!.wins+ contestor1!.draws/2;
        contestor2!.score = contestor2!.wins+ contestor2!.draws/2;

        tournament.contestors = tournament.contestors.sort((x, y)=>
        {
            if(x.score > y.score) return -1;
            if(y.score > x.score) return 1;
            if(x.rating > y.rating) return 1;
            if(y.rating > x.rating) return -1;
            return 0;
        });
    }

    get isTournamentFinnished()
    {
        if(!this.selectedTournament) return false;
        const tournament = this.selectedTournament;

        if(tournament.currentRound >= tournament.numberOfRounds && !this.hasActiveGames) return true;
        return false;
    }
}