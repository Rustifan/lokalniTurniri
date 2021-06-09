import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Grid, Header, Menu } from "semantic-ui-react"
import {  TournamentContestingFilterEnum } from "../../App/Interfaces/Tournament";
import { UserProfile } from "../../App/Interfaces/UserProfile"
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";
import TournamentPopup from "../TournamentPopup";

interface Props {
    profile: UserProfile;
}

export default observer(function ProfileTournaments({ profile }: Props) {

    const { profileStore } = store;
    const { loadProfileTournaments, profileTournamentsLoading, 
        selectedProfileTournamets} = profileStore;
    const [constestorFilter, setContestorFilter] = useState<TournamentContestingFilterEnum>("contestor");

    const handleClickMenuContestingItem = (filter: TournamentContestingFilterEnum) => {
        setContestorFilter(filter);
        loadProfileTournaments(filter, profile.username);
    }

    useEffect(() => {
       
            loadProfileTournaments(constestorFilter, profile.username);
    // eslint-disable-next-line    
    }, []) 

    return (
        <>
            <Header textAlign="center" as="h2">Turniri</Header>
            <Grid>
                <Grid.Column width="16" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Menu style={{ marginTop: 15 }} vertical>

                        <Menu.Item header style={{ backgroundColor: "#2185d0", color: "white" }}>
                            {profile.username} na sljedećim turnirima sudjeluje kao:
                        </Menu.Item>

                        <Menu.Item
                            color="blue" onClick={() => handleClickMenuContestingItem("contestor")}
                            active={constestorFilter === "contestor"}
                            name="contestor">
                            natjecatelj
                        </Menu.Item>

                        <Menu.Item
                            color="blue" onClick={() => handleClickMenuContestingItem("administrator")}
                            active={constestorFilter === "administrator"}
                            name="administrator">
                            administrator
                        </Menu.Item>
                    </Menu>
                </Grid.Column>

                {profileTournamentsLoading ?
                    <Grid.Column width="16">
                        <LoadingComponent text="Učitavanje turnira" />
                    </Grid.Column> :


                    selectedProfileTournamets.map(tournament => (
                        <Grid.Column key={tournament.id} width="4">

                            <TournamentPopup tournament={tournament} />
                        </Grid.Column>
                    ))

                }


            </Grid>
        </>
    )
});