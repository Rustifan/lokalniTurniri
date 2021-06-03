import React from "react"
import { TournamentFormValues } from "../../App/Interfaces/Tournament"
import { store } from "../../Stores/store"
import TournamentForm from "./TournamentForm"
import {Location} from "../../App/Interfaces/Location"


export default function CreateTournamentForm()
{
    const {tournamentStore} = store;

    const initialValues: TournamentFormValues= 
    {
        name: "",
        sport: "",
        location: new Location(),
        date: new Date(),
        numberOfRounds: 0
    }

    return(
        <TournamentForm header="Kreiraj turnir" initialValues={initialValues} onSubmit={tournamentStore.createTournament} />
    )
}