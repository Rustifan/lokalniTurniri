import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { userIcon } from "../../App/Core/Constants";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import {Button, Container, Grid, Header, Image, Segment} from "semantic-ui-react"

interface Props
{
    interlocutor: string;
}

export default observer(function MessageInterlocutor({interlocutor}: Props)
{
    const { profileStore: { getProfile, profileMap } } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    useEffect(() => {
        

        getProfile(interlocutor).then(value => setProfile(value));
    }, [interlocutor, setProfile, getProfile, profileMap.size]);

    return (
        <Segment>       
        <Container>
        <Grid>
        <Grid.Column width="5">
           <Image 
                circular 
                style={{width: "70px", marginLeft: "5px"}} 
                src={profile && profile.avatar ? profile.avatar : userIcon} 
                />
        </Grid.Column>
        <Grid.Column width="5">
            <Header>{interlocutor}</Header>
        </Grid.Column>
        </Grid>
       </Container>
       </Segment>

    )
})