import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Container } from "semantic-ui-react";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import AddPhoto from "./Photos/AddPhoto"
import ProfilePhotoList from "./Photos/ProfilePhotoList";

interface Props
{
    profile: UserProfile;
}

export default observer(function Photos({profile}: Props) 
{
    const {userStore, profileStore} = store;
    const {addPhotoMode, setAddPhotoMode} = profileStore;
   const {isLogedIn} = userStore;

    return(
        
        <Container>
        {addPhotoMode ? 
            <AddPhoto/> :
            <ProfilePhotoList profile={profile}/>
        }
    
    {isLogedIn(profile.username) &&
    <Button
        style={{marginTop: "20px"}}
        floated="right"
        content={addPhotoMode ? "Odustani" : "Dodaj sliku" }
        positive={!addPhotoMode}
        negative={addPhotoMode}
        onClick={()=>setAddPhotoMode(!addPhotoMode)}
        />
    }

        </Container>
    )


    
});



