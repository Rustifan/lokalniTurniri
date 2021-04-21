import { observer } from "mobx-react-lite";
import React, { useEffect } from "react"
import { useParams } from "react-router"
import { Image, Header, Segment, Dimmer, Grid, Label, Container } from "semantic-ui-react";
import PictureFromSport from "../../App/Tools/pictureFromSoprt";
import { store } from "../../Stores/store";
import TournamentCard from "./TournamentCard";

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
                    <Grid.Column width={16}>
                        <Header textAlign="center" as="h1">{selectedTournament.name}</Header>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Segment raised padded="very">
                            <Grid>


                                <Grid.Column width={8}>
                                    <Image circular size="medium" src={PictureFromSport(selectedTournament.sport)} />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <div style={marginBottom}>
                                        <Label color="red" size="big" pointing="right">Sport </Label>
                                        <Label color="blue" size="big">{selectedTournament.sport}</Label>
                                    </div>

                                    <div style={marginBottom}>
                                        <Label color="red" size="big" pointing="right">Lokacija </Label>
                                        <Label color="blue" size="big">{selectedTournament.location}</Label>
                                    </div>
                                </Grid.Column>

                            </Grid>
                        </Segment>
                    </Grid.Column>
                </Grid>

            }
        </>

    )
});