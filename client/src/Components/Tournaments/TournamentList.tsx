import { observer } from "mobx-react-lite";
import React, { useEffect } from "react"
import { Grid, Header, Item } from "semantic-ui-react"
import { store } from "../../Stores/store";
import TournamentCard from "./TournamentCard";


export default observer(() => {
    const { tournamentStore, userStore } = store;
    const { loadTournaments, tournamentList, tournamentMap } = tournamentStore;




    useEffect(() => {
        if (!tournamentMap.keys.length) {

            loadTournaments();
        }

    }, [loadTournaments, tournamentMap.keys.length, userStore.user])

    return (
        <>
            <Grid>
            <Grid.Column width="12">
            <Header as="h1" style={{padding: 20}} textAlign="center">Turniri</Header>
                
                <Item.Group divided>
                    {tournamentList.map(tournament => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))}
                </Item.Group>
                
            </Grid.Column>
            <Grid.Column>
                <Header textAlign="center" as="h2">Filteri</Header>
            </Grid.Column>
            
            </Grid>
        </>
    )
});