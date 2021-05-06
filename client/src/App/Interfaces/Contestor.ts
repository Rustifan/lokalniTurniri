export interface Contestor
{
    displayName: string;
    username: string | null;
    rating: number;
    Wins: number;
    Loses: number;
    Draws: number;
    Score: number;
    
}

export class Contestor
{
    constructor(displayName: string, username: string | null = null)
    {
        this.displayName = displayName;
        this.username = username;
        this.rating = 0;
        this.Wins = 0;
        this.Loses = 0;
        this.Draws = 0;
        this.Score = 0;
    }

}