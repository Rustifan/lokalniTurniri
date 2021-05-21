import { observer } from "mobx-react-lite"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Button, List, Popup, Image } from "semantic-ui-react";
import { userIcon } from "../../App/Core/Constants";
import { Tournament } from "../../App/Interfaces/Tournament";
import { UserProfile } from "../../App/Interfaces/UserProfile";
import { store } from "../../Stores/store";

interface Props
{
    admin: string;
    tournament: Tournament;
    setAdminToRemove: (admin: string)=>void;
}

export default observer(function AdminListItem({admin, tournament, setAdminToRemove}: Props) 
{
    const {tournamentStore} = store;
    const {isHost, setRemoveAdminModalOpen} = tournamentStore; 
    const [openRemoveAdminPopup, setOpenRemoveAdminPopup] = useState(false);
    const { profileStore: { getProfile, profileMap } } = store;
    const [profile, setProfile] = useState<UserProfile | undefined>(undefined);
    
    useEffect(() => {
        
        getProfile(admin).then(value => setProfile(value));
    }, [admin, setProfile, getProfile, profileMap]);

    return (
        <List.Item>

            <Popup
                disabled={!isHost() || admin === tournament.hostUsername}
                header={<Button size="mini" content="Ukloni" negative
                    onClick={() => {
                        setRemoveAdminModalOpen(true);
                        setOpenRemoveAdminPopup(false);
                        setAdminToRemove(admin)
                    }
                    } />}
                open={openRemoveAdminPopup}
                closeOnDocumentClick
                onOpen={() => setOpenRemoveAdminPopup(true)}
                onClose={() => setOpenRemoveAdminPopup(false)}
                on="hover"
                hoverable
                trigger={
                    <Image

                        size="mini"
                        avatar
                        src={profile && profile.avatar ? profile.avatar : userIcon}
                        style={{ border: admin === tournament.hostUsername ? "solid red 2px" : "none" }}
                    />}
            />
           
            <Link style={{ marginLeft: 5 }} to={"/userProfile/"+admin} >{admin}</Link>
            

        </List.Item>
    )
});
