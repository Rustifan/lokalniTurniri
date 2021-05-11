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
import TournamentTable from "./TournamentTable";
import TournamentGames from "./TournamentGames";
import Winners from "./Winners";
import Confetti from "react-confetti"
import { TournamentStore } from "../../Stores/tournamentStore";

interface Params {
    id: string;
}

export default observer(function TournamentDetails() {
   
    const { id } = useParams<Params>();
    const { tournamentStore: { isAdmin, selectTornament, selectedTournament, deselectTournament, isTournamentFinnished } } = store;
    useEffect(() => {
        selectTornament(id);

        return deselectTournament;
    }, [selectTornament, deselectTournament, id])

    return (
        <>
            
            {selectedTournament && isTournamentFinnished && 
                        <>
                        <Confetti height={2000}/>
                        <Winners contestors={selectedTournament.contestors}/>
                        </>
            }
            {selectedTournament ?
            
                <Grid style={{marginTop: 50}}>
                    <Grid.Column width="9">
                        <TournamentDetailsHeader tournament={selectedTournament}/>
                        <Segment.Group>
                        <TournamnetAdminList tournament={selectedTournament}/>
                        {isAdmin() &&
                        <TournamentAdminOptions tournament={selectedTournament}/>
                        }
                        </Segment.Group>
                    </Grid.Column>
                    <Grid.Column width="7">
                        {selectedTournament.currentRound !==0 ? <TournamentTable contestors={selectedTournament.contestors}/> :
                        <TournamentDetailsContestors contestors={selectedTournament!.contestors}/>}
                       

                    </Grid.Column>
                    {selectedTournament.currentRound !==0 &&
                    <Grid.Column width="16">
                        
                        <TournamentGames tournament={selectedTournament}/>
                    </Grid.Column>
                    }
                </Grid>
                :
                <Container style={{height: 500}}>
                    <LoadingComponent text="Učitavanje turnira"/>
                </Container>

            }
        </>

    )
});