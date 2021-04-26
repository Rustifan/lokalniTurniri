import { ErrorStore } from "./errorStore";
import { TournamentStore } from "./tournamentStore";
import { UserStore } from "./userStore";

interface Store
{
    errorStore: ErrorStore,
    tournamentStore: TournamentStore,
    userStore: UserStore
}

export const store: Store = 
{
    errorStore: new ErrorStore(),
    tournamentStore: new TournamentStore(),
    userStore: new UserStore()
}

