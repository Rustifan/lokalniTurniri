import { Contestor } from "./Contestor";

export interface Tournament
{
    id: string;
    sport: string;
    location: string;
    date: Date;
    hostUsername: string;
    admins: string[];
    numberOfRounds: number;
    currentRound: number;
    contestorNum: number;
    applicationsClosed: boolean;
    contestors: Contestor[];
}