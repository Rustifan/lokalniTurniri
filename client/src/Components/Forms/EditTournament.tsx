import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Container } from "semantic-ui-react";
import { TournamentFormValues } from "../../App/Interfaces/Tournament";
import { store } from "../../Stores/store"
import LoadingComponent from "../Loading/LoadingComponent";
import TournamentForm from "./TournamentForm";

export default observer(function EditTournament() {
    const { id } = useParams<{ id: string }>()
    const { tournamentStore: { selectTornament, selectedTournament, tournamentLoading, editTournament } } = store;
    const [initialValues, setInitialValues] = useState<TournamentFormValues>();

    useEffect(() => {
        if (selectedTournament) {

            setInitialValues(
            {
                    id: selectedTournament.id,
                    name: selectedTournament.name,
                    sport: selectedTournament.sport,
                    date: selectedTournament.date,
                    numberOfRounds: selectedTournament.numberOfRounds,
                    location: selectedTournament.location
            }
            );
        }
        else {
            selectTornament(id);
        }

    }, [setInitialValues, selectedTournament, id, selectTornament])

    return (
        !tournamentLoading && initialValues !== undefined ?
            (<TournamentForm
                header="Uredi Turnir"
                sendButtonContent="Uredi"
                initialValues={initialValues}
                onSubmit={editTournament} />)
            :
            (
                <Container style={{height: 500}}>
                    <LoadingComponent text="Učitavanje turnira"/>
                </Container>
            ))

});
