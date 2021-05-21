import React, { useEffect, useState } from "react"
import { Popup, Image, SemanticSIZES } from "semantic-ui-react"
import { userIcon } from "../../App/Core/Constants"
import { UserProfile } from "../../App/Interfaces/UserProfile"
import { store } from "../../Stores/store"
import UserCard from "./UserCard"

interface Props
{
    user: string;
    highlited?: boolean;
    size?: SemanticSIZES;
}

export default function UserPopup({user, highlited=false, size=undefined}: Props)
{
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    const {profileStore: {getProfile}} = store;
    useEffect(()=>
    {
        getProfile(user).then(value=>setProfile(value));
    }, [setProfile, user, getProfile]);
    


    return (
        
        <Popup
            hoverable
            header={profile ? <UserCard profile={profile}/> : user}
            trigger={
            <Image 
                 size={size}
                 avatar 
                 src={profile && profile.avatar ? profile?.avatar : userIcon}
                 style={{border: highlited ? "solid red 2px" : "none"}}
                 />}
        />
        
        
    )
}