import { observer } from "mobx-react-lite";
import React, { useEffect } from "react"
import { Grid, Header, Item } from "semantic-ui-react"
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";
import TournamentCard from "./TournamentCard";


export default observer(() => {
    const { tournamentStore, userStore } = store;
    const { loadTournaments, tournamentList, ifLoaded, tournamentLoading, tournamentMap } = tournamentStore;

    useEffect(() => {
        if (!ifLoaded()) {
            
            
            loadTournaments();
        }

    }, [loadTournaments, tournamentMap.keys.length, userStore.user, ifLoaded])

    return (
        <>
            <Grid>
                <Grid.Column width="12">
                    <Header as="h1" style={{ padding: 20 }} textAlign="center">Turniri</Header>

                    {tournamentLoading ? 
                    <LoadingComponent text="Učitavanje turnira" /> :
                        (<Item.Group divided>
                            {tournamentList.map(tournament => (
                                <TournamentCard key={tournament.id} tournament={tournament} />
                            ))}
                        </Item.Group>)}


                </Grid.Column>
                <Grid.Column>
                    <Header textAlign="center" as="h2">Filteri</Header>
                </Grid.Column>

            </Grid>
        </>
    )
});