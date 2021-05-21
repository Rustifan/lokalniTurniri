import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Button, Header, Item } from "semantic-ui-react";
import { userIcon } from "../../App/Core/Constants";
import { Contestor } from "../../App/Interfaces/Contestor";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";

interface Props
{
    contestor: Contestor;
    handleTryRemoveContestor: (Contestor: Contestor)=>void;
}

export default observer(function ContestorItem({contestor, handleTryRemoveContestor}: Props) 
{
    const {tournamentStore} = store;
    const {isAdmin, selectedTournament} = tournamentStore;
    const { profileStore: { getProfile, profileMap } } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    
    useEffect(() => {
        if(contestor.username)
        {

            getProfile(contestor.username).then(value => setProfile(value));
        }
    }, [contestor.username, setProfile, getProfile, profileMap]);


    return (
        <Item key={contestor.displayName}>
            <Item.Image 
                size="tiny" 
                src={profile && profile.avatar ? profile.avatar : userIcon} />
            <Item.Content>
                {contestor.username ? 
                <Header as={Link} to={"/userProfile/"+contestor.username}>
                    {contestor.displayName}
                </Header> :
                <Header>
                    {contestor.displayName}
                </Header> 
                }
            </Item.Content>
            {isAdmin() && !selectedTournament?.applicationsClosed &&
                <Button
                    size="small"
                    compact
                    key={contestor.displayName}
                    content="Izbaci" negative
                    style={{ height: "30%", alignSelf: "bottom" }}
                    onClick={() => handleTryRemoveContestor(contestor)}
                />}



        </Item>
    )
});