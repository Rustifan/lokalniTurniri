import React, { useState } from "react"
import { Button, Container } from "semantic-ui-react";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";
import AddPhoto from "./Photos/AddPhoto"

interface Props
{
    profile: UserProfile;
}

export default function Photos({profile}: Props) 
{
   const [addPhotoMode, setAddPhotoMode] = useState(false);
   const {userStore} = store;
   const {isLogedIn} = userStore;

    return(
        
        <Container clearing>
        {addPhotoMode ? 
            <AddPhoto/> :
            <div>Grafije</div>
        }
    
    {isLogedIn(profile.username) &&
    <Button
        floated="right"
        content={addPhotoMode ? "Odustani" : "Dodaj sliku" }
        positive={!addPhotoMode}
        negative={addPhotoMode}
        onClick={()=>setAddPhotoMode(value=>!value)}
        />
    }

        </Container>
    )


    
}



