import { store } from "../../Stores/store";
import { Contestor } from "./Contestor";
import { Game } from "./Game";
import {Location} from "../../App/Interfaces/Location"

export interface Tournament
{
    id: string;
    name: string;
    sport: string;
    location: Location;
    date: Date;
    hostUsername: string;
    admins: string[];
    numberOfRounds: number;
    currentRound: number;
    contestorNum: number;
    applicationsClosed: boolean;
    contestors: Contestor[];
    games: Game[];
}

export interface TournamentFormValues
{
    id?: string;
    name: string;
    sport: string;
    location: Location;
    date: Date;
    numberOfRounds: number; 
}

export class Tournament
{
    constructor(tournament: TournamentFormValues)
    {
        if(tournament.id) this.id = tournament.id;
        this.name = tournament.name;
        this.sport = tournament.sport;
        this.location = tournament.location;
        this.date = tournament.date;
        this.numberOfRounds = tournament.numberOfRounds;
        if(store.userStore.user?.username)
        {
            this.hostUsername = store.userStore.user.username;         
            this.admins = [store.userStore.user.username];
        } 
        this.currentRound = 0;
        this.contestorNum = 0;
        this.applicationsClosed = false;
        this.contestors = [];
        this.games = [];
    }
}