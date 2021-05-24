import { observer } from "mobx-react-lite";
import React from "react"
import { Grid, Header } from "semantic-ui-react"
import { UserProfile } from "../../../App/Interfaces/UserProfile"
import ProfileImage from "./ProfileImage"

interface Props
{
    profile: UserProfile;
}

export default observer(function ProfilePhotoList({profile}: Props)
{
    return(
        <>
        <Header style={{padding: 20}} textAlign="center" as="h2">Slike</Header>
        <Grid>
            {profile.images &&
            profile.images.map((photo)=>(
            
                <Grid.Column key={photo.id} width="4">
                    <ProfileImage profile={profile} photo={photo}/>
                </Grid.Column>
            ))
            }
        </Grid>
        </>
    )
});