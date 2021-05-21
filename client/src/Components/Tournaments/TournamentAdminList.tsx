import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import {  Header, List, Segment, Button } from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import { store } from "../../Stores/store"
import YesNoModal from "../Common/YesNoModal"
import AddAdminModal from "./AddAdminModal"
import AdminListItem from "./AdminListItem"

interface Props {
    tournament: Tournament;

}

export default observer(function TournamnetAdminList({ tournament }: Props) 
{
    const { tournamentStore } = store;
    const { editingTournament, removeAdminModalOpen, removeAdmin, setRemoveAdminModalOpen, isHost, setAddAdminModalOpen } = tournamentStore;
    const [adminToRemove, setAdminToRemove] = useState<string | null>(null);



    const handleRemovingAdmin = () => {
        if (!adminToRemove) return;
        removeAdmin(adminToRemove);
        setAdminToRemove(null);
    }

    return (
        <Segment>
            <AddAdminModal />

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
                        onClick={() => setAddAdminModalOpen(true)}
                        content="Dodaj administratora"
                    />
                }
            </Header>
            <List horizontal>

                {tournament.admins.map(((admin, i) => (
                    <AdminListItem key={i} setAdminToRemove={setAdminToRemove} admin={admin} tournament={tournament} />
                )

                ))}

            </List>
        </Segment>
    )
});