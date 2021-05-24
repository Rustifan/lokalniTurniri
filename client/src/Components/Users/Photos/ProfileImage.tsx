import { observer } from "mobx-react-lite";
import React from "react"
import { Button, Image, Segment } from "semantic-ui-react";
import { Photo } from "../../../App/Interfaces/Photo";
import { UserProfile } from "../../../App/Interfaces/UserProfile";
import { store } from "../../../Stores/store";

interface Props {
    profile: UserProfile;
    photo: Photo;
}

export default observer(function ProfileImage({ profile, photo }: Props) {

    const {profileStore, userStore} = store;
    const {deletingPhotoId, deleteImage, settingAvatarId, setAvatar} = profileStore;

    return (
        <Segment.Group>
            <Segment style={{ padding: 0 }}>
                <Image src={photo.url} />
            </Segment>
            
            { userStore.isLogedIn(profile.username) &&
            <Segment style={{display: "flex", justifyContent: "space-around"}}>
                <Button 
                    size="tiny" 
                    positive 
                    icon="check" 
                    content="Izaberi"
                    onClick={()=>setAvatar(photo.id)}
                    loading={settingAvatarId === photo.id}
                    disabled={settingAvatarId === photo.id || profile.avatar === photo.url}
                    />
                <Button 
                    size="tiny" 
                    negative 
                    icon="x" 
                    content="Izbriši"
                    onClick={()=>deleteImage(photo.id)}
                    loading={deletingPhotoId === photo.id}
                    disabled={deletingPhotoId === photo.id}
                    />

                
            </Segment>
            }
        </Segment.Group>
    )
});