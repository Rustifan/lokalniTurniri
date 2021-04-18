import {makeAutoObservable} from "mobx";
import { agent } from "../App/agent";
import { Tournament } from "../App/Interfaces/Tournament";

export class TournamentStore
{
    tournamentMap = new Map<string, Tournament>();    
    
    
    constructor()
    {
        makeAutoObservable(this);
    }

    loadTournaments = async ()=>
    {
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
}