import {makeAutoObservable, runInAction} from "mobx";
import { agent } from "../App/agent";
import { CreateTournament, Tournament } from "../App/Interfaces/Tournament";
import { store } from "./store";
import {v4 as uuid} from "uuid"
export class TournamentStore
{
    tournamentLoading = false;
    tournamentMap = new Map<string, Tournament>();    
    selectedTournament: Tournament | undefined = undefined;
    creatingTournament = false;    
    
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

    createTournament = async (createdTournament: CreateTournament)=>
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