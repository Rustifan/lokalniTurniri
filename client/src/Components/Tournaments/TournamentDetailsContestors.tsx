import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import {  Header, Item, Segment } from "semantic-ui-react"
import { AddContestor } from "../../App/Interfaces/AddContestor"
import { Contestor } from "../../App/Interfaces/Contestor"
import { store } from "../../Stores/store"
import YesNoModal from "../Common/YesNoModal"
import ContestorItem from "./ContestorItem"

interface Props {
    contestors: Contestor[];
}

export default observer( function TournamentDetailsContestors({ contestors }: Props) {

    const {tournamentStore: {removeContestor, participateLoading}} = store;
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [contestorToRemove, setContestorToRemove] = useState<Contestor | null>(null);

    const handleTryRemoveContestor = (contestor: Contestor)=>
    {
        setRemoveModalOpen(true);
        setContestorToRemove(contestor);
    }

    const handleRemoveContestor = async ()=>
    {
        if(!contestorToRemove) return;

        const values: AddContestor =
        {
            name: contestorToRemove.displayName,
            isGuest: contestorToRemove.username === null
        }
        await removeContestor(values);
        setRemoveModalOpen(false);

        
    }


    
    return (

        <>
        <YesNoModal 
            question="Dali stvarno želite izbaciti natjecatelja sa turnira"
            open={removeModalOpen}
            setOpen={setRemoveModalOpen}
            onSubmit={handleRemoveContestor}
            loading={participateLoading}
            />
        <Segment.Group>
            <Segment color="blue" inverted attached="bottom">
                <Header as="h3" textAlign="center">Natjecatelji</Header>
            </Segment>
            <Segment clearing>
                <Item.Group divided>
                    {contestors.map((contestor) => (

                        <ContestorItem key={contestor.displayName} contestor={contestor} handleTryRemoveContestor={handleTryRemoveContestor}/>

                    ))}
                </Item.Group>
            </Segment>
        </Segment.Group>
        </>
    )
})
