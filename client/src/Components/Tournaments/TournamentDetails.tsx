import React from "react"
import { observer } from "mobx-react-lite";
import { useEffect } from "react"
import { useParams } from "react-router"
import { Grid } from "semantic-ui-react";
import { store } from "../../Stores/store";
import TournamentDetailsContestors from "./TournamentDetailsContestors";
import TournamentDetailsHeader from "./TournamentDetailsHeader";

interface Params {
    id: string;
}

export default observer(function TournamentDetails() {
    const { id } = useParams<Params>();
    const { tournamentStore: { selectTornament, selectedTournament, deselectTournament, tournamentLoading } } = store;
    useEffect(() => {
        selectTornament(id);

        return deselectTournament;
    }, [selectTornament, deselectTournament, id])



    if (tournamentLoading) return (<div>load</div>)
    return (
        <>
            {selectedTournament &&

                <Grid style={{marginTop: 50}}>
                    <Grid.Column width="10">
                        <TournamentDetailsHeader tournament={selectedTournament}/>
                    </Grid.Column>
                    <Grid.Column width="5">
                        <TournamentDetailsContestors contestors={selectedTournament.contestors}/>
                    </Grid.Column>
                </Grid>
                

            }
        </>

    )
});