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
    description: string;
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
    description: string;
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
        this.description = tournament.description;
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

export type TournamentContestingFilterEnum = "all" | "contestor" | "administrator";
export type TournamentFlowFilterEnum = "all" | "openApplications" | "inProcess" | "ended";
export type TournamentToggleFilterEnum = "map" | "list";

export class TournamentLoadingParams
{
    itemPerPage = 4; //minimal 3 to scroll 
    totalPages = 0;
    currentPage = 1;
    contestingFilter: TournamentContestingFilterEnum = "all";
    flowFilter: TournamentFlowFilterEnum = "all";
    toggleFilter: TournamentToggleFilterEnum = "list";
    searchUsername?: string = undefined;

    date = new Date();

    toUrlParams = ()=>
    {
        const params = new URLSearchParams();
        if(this.toggleFilter ==="list")
        {
            
            params.set("itemsPerPage", this.itemPerPage.toString());
            params.set("currentPage", this.currentPage.toString());
        }
        else
        {
            params.set("mapMode", "true");
        }
        params.set("contestingFilter", this.contestingFilter);
        params.set("flowFilter", this.flowFilter);
        params.set("date", this.date.toLocaleDateString());
        if(this.searchUsername)
        {
            params.set("searchUsername", this.searchUsername);
        }


        return params;
    }
}