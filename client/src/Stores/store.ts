import { ErrorStore } from "./errorStore";
import { MessageStore } from "./messageStore";
import { ProfileStore } from "./profileStore";
import { TournamentStore } from "./tournamentStore";
import { UserStore } from "./userStore";

interface Store
{
    errorStore: ErrorStore,
    tournamentStore: TournamentStore,
    userStore: UserStore,
    profileStore: ProfileStore,
    messageStore: MessageStore
}

export const store: Store = 
{
    errorStore: new ErrorStore(),
    tournamentStore: new TournamentStore(),
    userStore: new UserStore(),
    profileStore: new ProfileStore(),
    messageStore: new MessageStore()
}

