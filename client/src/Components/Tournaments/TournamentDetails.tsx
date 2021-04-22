import { observer } from "mobx-react-lite";
import React, { useEffect } from "react"
import { useParams } from "react-router"
import { Image, Header, Segment, Dimmer, Grid, Label, Container, GridColumn } from "semantic-ui-react";
import PictureFromSport from "../../App/Tools/pictureFromSoprt";
import { store } from "../../Stores/store";
import TournamentCard from "./TournamentCard";
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
    }, [selectTornament])

    const marginBottom=
    {
        marginBottom: 10
    }


    if (tournamentLoading) return (<div>load</div>)
    return (
        <>
            {selectedTournament &&

                <Grid>
                    <Grid.Column width="10">
                        <TournamentDetailsHeader tournament={selectedTournament}/>
                    </Grid.Column>
                </Grid>
                

            }
        </>

    )
});