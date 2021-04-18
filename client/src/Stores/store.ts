import { TournamentStore } from "./tournamentStore";
import { UserStore } from "./userStore";

interface Store
{
    tournamentStore: TournamentStore,
    userStore: UserStore
}

export const store: Store = 
{
    tournamentStore: new TournamentStore(),
    userStore: new UserStore()
}

