import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Image, Header, List, Popup, Segment, Button } from "semantic-ui-react"
import { userIcon } from "../../App/Core/Constants"
import { Tournament } from "../../App/Interfaces/Tournament"
import { store } from "../../Stores/store"
import YesNoModal from "../Common/YesNoModal"
import AddAdminModal from "./AddAdminModal"

interface Props
{
    tournament: Tournament;

}

export default observer(function TournamnetAdminList({tournament}: Props)
{
    const {tournamentStore} = store;
    const {editingTournament, removeAdminModalOpen, removeAdmin, setRemoveAdminModalOpen, isHost, setAddAdminModalOpen} = tournamentStore;
    const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
    const [openRemoveAdminPopup, setOpenRemoveAdminPopup] = useState(false);

    const handleRemovingAdmin = ()=>
    {
        if(!adminToRemove) return;
        removeAdmin(adminToRemove);
        setAdminToRemove(null);
    }

    return(
        <Segment>
        <AddAdminModal/>

        <YesNoModal
            open={removeAdminModalOpen}
            setOpen={setRemoveAdminModalOpen}
            question="Dali stvarno želite ukloniti administratora?"
            loading={editingTournament}
            onSubmit={handleRemovingAdmin}
            />
        <Header as="h2">Administratori
        {isHost() &&
        <Button
            floated="right"
            color="blue"
            onClick={()=>setAddAdminModalOpen(true)}
            content="Dodaj administratora"
            />
        }
        </Header>
        <List horizontal>

                        {tournament.admins.map(((admin, i) => (

                            <List.Item key={i}>
                                
                                <Popup
                                    disabled={!isHost() || admin===tournament.hostUsername}
                                    header={<Button size="mini" content="Ukloni" negative 
                                        onClick={()=>{
                                            setRemoveAdminModalOpen(true);
                                            setOpenRemoveAdminPopup(false);
                                            setAdminToRemove(admin)
                                            }
                                            }/>}
                                    open={openRemoveAdminPopup}
                                    closeOnDocumentClick
                                    onOpen={()=>setOpenRemoveAdminPopup(true)}
                                    onClose={()=>setOpenRemoveAdminPopup(false)}
                                    on="click"
                                    trigger={
                                    <Image 
                                    
                                    size="mini"
                                    avatar 
                                    src={userIcon}
                                    style={{border: admin===tournament.hostUsername ? "solid red 2px" : "none"}}
                                        />}
                                    />
                                <span style={{marginLeft: 5}}>{admin}</span>
                             
                            </List.Item>)

                        ))}

        </List>
        </Segment>
    )
});