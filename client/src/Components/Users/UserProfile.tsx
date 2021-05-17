import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router";
import { Container, Grid, Header, Image, Segment } from "semantic-ui-react";
import { userIcon } from "../../App/Core/Constants";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";

interface Params {
    username: string;
}

export default observer(function UserProfile() {

    const { profileStore: { getProfile } } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    const { username } = useParams<Params>();
    useEffect(() => {
        if (!username) return;
        getProfile(username).then(value => setProfile(value));
    }, [username, setProfile]);

    if (!profile)
        return (
            <Container style={{ height: 200, marginTop: 50 }}>
                <LoadingComponent text="Učitavanje profila" />
            </Container>
        )

    return (

        <Grid style={{marginTop: 50}}>
            <Grid.Column width="10">
                <Segment>
                    <Grid>
                    <Grid.Column width="8">
                        <Image inline size="small" circular src={profile.avatar ? profile.avatar : userIcon} />
                    </Grid.Column>
                    <Grid.Column verticalAlign="middle" width="8">
                        <Header as="h1">{profile.username}</Header>
                    </Grid.Column>
                    </Grid>
                </Segment>
            </Grid.Column>
        </Grid>
    )
});