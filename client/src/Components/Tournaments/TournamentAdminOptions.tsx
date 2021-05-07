import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Accordion, Button, Header, Icon, Segment } from "semantic-ui-react"
import { Tournament } from "../../App/Interfaces/Tournament"
import { store } from "../../Stores/store"
import YesNoModal from "../Common/YesNoModal"
import AddContestorModal from "./AddContestorModal"

interface Props {
    tournament: Tournament;
}

export default observer(function TournamentAdminOptions({ tournament }: Props) {

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const { tournamentStore} = store;
    const { setAddContestorModalOpen, closeApplicationsLoading, closeApplications } = tournamentStore;
    const [accordionActive, setAccordionActive] = useState(false);

    return (
        <Segment>
            <Accordion>
                <Accordion.Title 
                    active={accordionActive}
                    onClick={()=>setAccordionActive(value=>!value)}
                    >
                    
                    <Header as="h2"><Icon name="dropdown"/>Administratorske opcije</Header>
                </Accordion.Title>
                <Accordion.Content active={accordionActive}>
                    <YesNoModal question="Dali zaista želite izbrisati turnir?"
                        loading={tournamentStore.tournamentLoading}
                        setOpen={setDeleteModalOpen}
                        open={deleteModalOpen}
                        onSubmit={() => tournamentStore.deleteTournament(tournament.id)}
                    />
                    <AddContestorModal />
                    <>
                        <Button
                            color="green"
                            content="Dodaj natjecatelja"
                            onClick={() => setAddContestorModalOpen(true)}

                        />
                        <Button
                            floated="right"
                            negative
                            content="Izbriši"
                            onClick={() => setDeleteModalOpen(true)}

                        />
                        <Button
                            as={Link}
                            to={`/tournaments/${tournament.id}/edit`}
                            color="blue" content="Uredi"
                            floated="right"
                            />
                        
                        <Button
                            color={tournament.applicationsClosed ? "yellow" : "orange"}
                            content={tournament.applicationsClosed ? "Otvori prijave": "Zatvori prijave"}
                            onClick={closeApplications}
                            loading={closeApplicationsLoading}
                            disabled={closeApplicationsLoading}
                            />
                    </>
                </Accordion.Content>
            </Accordion>
        </Segment>
    )
});