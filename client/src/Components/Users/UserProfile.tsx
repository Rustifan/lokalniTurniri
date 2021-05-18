import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Container, Grid, Header, Icon, Image, Label, Segment, Tab } from "semantic-ui-react";
import { userIcon } from "../../App/Core/Constants";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import LoadingComponent from "../Loading/LoadingComponent";
import ProfileBio from "./ProfileBio";

interface Params {
    username: string;
}

export default observer(function UserProfile() {

    const { profileStore: { getProfile }, userStore:{isLogedIn} } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    const { username } = useParams<Params>();
    useEffect(() => {
        if (!username) return;
        getProfile(username).then(value => setProfile(value));
    }, [username, setProfile, getProfile]);

    if (!profile)
        return (
            <Container style={{ height: 200, marginTop: 50 }}>
                <LoadingComponent text="Učitavanje profila" />
            </Container>
        )

        const panes = [
            { menuItem: 'O korisniku', render: () => <Tab.Pane><ProfileBio bio={profile.bio}/></Tab.Pane> },
            { menuItem: 'Fotografije', render: () => <Tab.Pane>Fotografije</Tab.Pane> },
            { menuItem: 'Turniri', render: () => <Tab.Pane>Turniri</Tab.Pane> },
          ]

    return (
        
        <Grid style={{ marginTop: 50 }}>
            <Grid.Column width="16">
                <Segment.Group>
                <Segment>
                    <Grid>
                        <Grid.Column width="8">
                            <Image size="medium" circular src={profile.avatar ? profile.avatar : userIcon} />
                        </Grid.Column>
                        <Grid.Column verticalAlign="middle" width="8">
                            <Header as="h1">{profile.username}</Header>
                            
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment clearing>
                    <Label as="a" href={"mailto:"+profile.email} color="blue"><Icon name="mail"/>{profile.email}</Label>
                    {
                        isLogedIn(profile.username) &&
                        <Button floated="right" color="blue" as={Link} to={`/userProfile/${profile.username}/edit`}>Uredi profil</Button>
                    }
                    {
                        !isLogedIn(profile.username) &&
                        <Button floated="right" positive>Pošalji poruku</Button>
                    }
                </Segment>
                </Segment.Group>
            </Grid.Column>
            <Grid.Column width="16">
                <Tab menuPosition="right" menu={{fluid: true,  vertical: true }} panes={panes} />
            </Grid.Column>
        </Grid>
    )
});