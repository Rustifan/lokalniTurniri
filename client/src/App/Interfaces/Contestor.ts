export interface Contestor
{
    displayName: string;
    username: string | null;
    rating: number;
    wins: number;
    loses: number;
    draws: number;
    score: number;
    
}

export class Contestor
{
    constructor(displayName: string, username: string | null = null)
    {
        this.displayName = displayName;
        this.username = username;
        this.rating = 0;
        this.wins = 0;
        this.loses = 0;
        this.draws = 0;
        this.score = 0;
    }

}