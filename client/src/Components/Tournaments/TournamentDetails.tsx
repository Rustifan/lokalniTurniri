import React from "react"
import { observer } from "mobx-react-lite";
import { useEffect } from "react"
import { useParams } from "react-router"
import { Container, Grid, Segment } from "semantic-ui-react";
import { store } from "../../Stores/store";
import TournamentDetailsContestors from "./TournamentDetailsContestors";
import TournamentDetailsHeader from "./TournamentDetailsHeader";
import LoadingComponent from "../Loading/LoadingComponent";
import TournamentAdminOptions from "./TournamentAdminOptions";
import TournamnetAdminList from "./TournamentAdminList";

interface Params {
    id: string;
}

export default observer(function TournamentDetails() {
    const { id } = useParams<Params>();
    const { tournamentStore: { isAdmin, selectTornament, selectedTournament, deselectTournament } } = store;
    useEffect(() => {
        selectTornament(id);

        return deselectTournament;
    }, [selectTornament, deselectTournament, id])


    
    return (
        <>
            
            {selectedTournament ?

                <Grid style={{marginTop: 50}}>
                    <Grid.Column width="10">
                        <TournamentDetailsHeader tournament={selectedTournament}/>
                        <Segment.Group>
                        <TournamnetAdminList tournament={selectedTournament}/>
                        {isAdmin() &&
                        <TournamentAdminOptions tournament={selectedTournament}/>
                        }
                        </Segment.Group>
                    </Grid.Column>
                    <Grid.Column width="5">
                        <TournamentDetailsContestors contestors={selectedTournament.contestors}/>
                    </Grid.Column>
                </Grid>
                :
                <Container style={{height: 500}}>
                    <LoadingComponent text="Učitavanje turnira"/>
                </Container>

            }
        </>

    )
});