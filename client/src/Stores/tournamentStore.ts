import {makeAutoObservable, runInAction} from "mobx";
import { agent } from "../App/agent";
import { TournamentFormValues, Tournament } from "../App/Interfaces/Tournament";
import { store } from "./store";
import {v4 as uuid} from "uuid"
import { history } from "..";
export class TournamentStore
{
    tournamentLoading = false;
    tournamentMap = new Map<string, Tournament>();    
    selectedTournament: Tournament | undefined = undefined;
    creatingTournament = false;   
    editingTournament = false; 
    
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
        this.tournamentMap.set(tournament.id, tournament);
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
            history.push("/tournaments/"+createdTournament.id);
        }
        catch(err)
        {
            console.log(err);
        }
        finally
        {
            runInAction(()=>this.creatingTournament === false);
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

}